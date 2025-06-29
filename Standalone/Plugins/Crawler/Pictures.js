import Config from '../../Classes/Config.class.js';
import GraphBuilder from '../../Classes/Network/GraphBuilder.class.js';
import { GraphQL, Type } from '../../Classes/Network/GraphQL.class.js';
import IPlugin from '../../Classes/IPlugin.interface.js';
import Logger from '../../Classes/Logger.class.js';
import Database from '../../Classes/Database.class.js';
import Calendar from '../../Classes/Utils/Calendar.class.js';
import Fetch from 'node-fetch';
import Crypto from 'node:crypto';
import FileSystem from 'node:fs/promises';

export default class Pictures extends IPlugin {
	Client			= null;
	Channels		= null;
	Profiles		= {};
	Queue			= [];
	Watcher			= null;
	
    constructor(client) {
        super();
		
		if(!Config.get('Plugins.Crawler.Enabled', true)) {
			return;
		}
		
		this.Client		= client;
		this.Channels	= this.Client.getPlugin('Channels');
		
		this.updateStatistics();
		
		/* When Users inited */
		this.Channels.on('users', () => {
			this.Profiles	= this.Channels.getUsers();
			this.Watcher	= setInterval(() => this.handleProfileFetch(), 500);
		});
		
		/* When new User added */
		this.Channels.on('user', (user) => {
			this.Profiles[user.id] = user;
		});
    }
	
	async updateStatistics() {
		let statistics	= await Database.single('SELECT COUNT(`id`) AS `total` FROM `pictures`');
		
		await Database.update('statistics', [ 'name' ], {
			name:	'pictures',
			value:	statistics.total
		});
	}
	
	async handleProfileFetch() {
		if(Object.keys(this.Profiles).length === 0) {
			return;
		}
		
		if(this.Queue.length === 0) {
			this.Queue = [...Object.values(this.Profiles)];
			
			if(Config.get('Logging.Plugins.Crawler.Pictures', true)) {
				Logger.info('[Crawler:Pictures]', 'Requeue Profiles.', this.Queue.length);
			}
		}
		
		let user = this.Queue.shift();
		
		if(!user) {
			return;
		}
		
		if(Config.get('Logging.Plugins.Crawler.Pictures', true)) {
			Logger.info('[Crawler:Pictures]', 'Fetch', user.nickname);
		}
		
		try {
			await this.fetchProfile(user);
		} catch(error) {
			Logger.error('[Crawler:Pictures]', 'Fetch error', error);
		}
	}
	
	async fetchProfile(user) {
		const url = this.createURL(user.nickname);

		try {
			const response = await Fetch(url);
			
			if(response.status !== 200) {
				if(Config.get('Logging.Plugins.Crawler.Pictures', true)) {
					Logger.warning('[Crawler:Pictures]', 'Image not found', user.nickname);
				}
				return;
			}

			const buffer	= Buffer.from(await response.arrayBuffer());
			const checksum	= Crypto.createHash('sha256').update(buffer).digest('hex');

			if(!await Database.exists('SELECT `id` FROM `pictures` WHERE `user`=:id AND `checksum`=:checksum LIMIT 1', {
				id: user.id,
				checksum
			})) {
				if(Config.get('Logging.Plugins.Crawler.Pictures', true)) {
					Logger.success('[Crawler:Pictures]', 'Download', user.nickname);
				}

				const id = await Database.insert('pictures', {
					id:				null,
					user:			user.id,
					time_created:	'NOW()',
					url,
					checksum
				});
				
				this.updateStatistics();

				await FileSystem.writeFile(`./storage/pictures/profiles/${id}.img`, buffer);
			}
		} catch(error) {
			Logger.error('[Crawler:Pictures]', 'FetchProfile error', error);
		}
	}
	
	createURL(nickname) {
		nickname			= this.escape(nickname);
		const mode			= 'vl';
		const usernameShort	= nickname.length >= 3 ? nickname.substr(0, 3) : nickname;
		
		return `https://cdn.knuddelscom.de/knuddels.de/${usernameShort}/${nickname}-pro0${mode}0p.img`;
	}
	
	escape(nickname) {
		let result				= '';
		const asciiDecimalForA	= 97; // 'a'
		nickname				= nickname.toLowerCase();
		
		for(let i = 0; i < nickname.length; i++) {
			const c = nickname.charCodeAt(i);
			
			if((c >= 97 && c <= 122) || (c >= 65 && c <= 90) || (c >= 48 && c <= 57)) {
				result = result + String.fromCharCode(c);
			} else if(c === 32) {
				result = result + '_-';
			} else if (c < 256) {
				result = result + '_' + String.fromCharCode(((c >>> 4) & 15) + asciiDecimalForA) + String.fromCharCode((c & 15) + asciiDecimalForA);
			} else {
				result = result + '__' + String.fromCharCode(((c >>> 12) & 15) + asciiDecimalForA) + String.fromCharCode(((c >>> 8) & 15) + asciiDecimalForA) + String.fromCharCode(((c >>> 4) & 15) + asciiDecimalForA) + String.fromCharCode((c & 15) + asciiDecimalForA);
			}
		}
		
		return result;
	}
}