import Config from '../../Classes/Config.class.js';
import GraphBuilder from '../../Classes/Network/GraphBuilder.class.js';
import { GraphQL, Type } from '../../Classes/Network/GraphQL.class.js';
import IPlugin from '../../Classes/IPlugin.interface.js';
import Logger from '../../Classes/Logger.class.js';
import Database from '../../Classes/Database.class.js';
import Calendar from '../../Classes/Utils/Calendar.class.js';
import Fetch from 'node-fetch';
import Crypto from 'node:crypto';

export default class Pictures extends IPlugin {
	Client			= null;
	Channels		= null;
	Profiles		= {};
	Queue			= [];
	Watcher			= null;
	
    constructor(client) {
        super();
		
		this.Client		= client;
		this.Channels	= this.Client.getPlugin('Channels');
		
		
		/* When Users inited */
		this.Channels.on('users', () => {
			this.Profiles = this.Channels.getUsers();
			
			this.Watcher = setInterval(() => {
				this.handleProfileFetch();
			}, 500);
		});
		
		/* When new User added */
		this.Channels.on('user', (user) => {
			this.Profiles[user.id] = user;
		});
    }
	
	handleProfileFetch() {
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
		
		if(typeof(user) === 'undefined' || user === null) {
			return;
		}
		
		if(Config.get('Logging.Plugins.Crawler.Pictures', true)) {
			Logger.info('[Crawler:Pictures]', 'Fetch', user.nickname);
		}
		
		this.fetchProfile(user);
	}
	
	async fetchProfile(user) {
		const url = this.createURL(user.nickname);
		
		Fetch(url).then(async (response) => {
			if(response.status === 200) {
				const buffer	= Buffer.from(await response.arrayBuffer());
				const checksum	= Crypto.createHash('sha256').update(buffer).digest('hex');
				
				if(!(await Database.exists('SELECT `id` from `pictures` WHERE `id`=:id AND `checksum`=:checksum LIMIT 1', {
					id:			user.id,
					checksum:	checksum
				}))) {
					if(Config.get('Logging.Plugins.Crawler.Pictures', true)) {
						Logger.success('[Crawler:Pictures]', 'Download', user.nickname);
					}
					
					Database.insert('pictures', {
						id:				user.id,
						url:			url,
						checksum:		checksum,
						binary:			buffer,
						time_created:	'NOW()'
					});
				}
			}
		}).catch((error) => {
			console.error(error);
		});
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
	
	/*
	__fetchEventRequest {
		"id":"0.7979768482321417",
		"data":{
			"userId":68984856,
			"scope":"Photo",
			"reportId":"d297c57b-97d9-4712-97e6-aa9701fe71ae",
			"reasonId":"0.7",
			"reportType":"PHOTO"
		},"key":"getReportedData"}
	*/
}