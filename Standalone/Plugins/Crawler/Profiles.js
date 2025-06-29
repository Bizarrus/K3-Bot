import Config from '../../Classes/Config.class.js';
import GraphBuilder from '../../Classes/Network/GraphBuilder.class.js';
import { GraphQL, Type } from '../../Classes/Network/GraphQL.class.js';
import IPlugin from '../../Classes/IPlugin.interface.js';
import Logger from '../../Classes/Logger.class.js';
import Database from '../../Classes/Database.class.js';
import Calendar from '../../Classes/Utils/Calendar.class.js';

export default class Profiles extends IPlugin {
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
	
	async updateStatistics() {
		let statistics	= await Database.single('SELECT COUNT(`id`) AS `total` FROM `profiles`');
		
		await Database.update('statistics', [ 'name' ], {
			name:	'profiles',
			value:	statistics.total
		});
	}
	
	async handleProfileFetch() {
		if(Object.keys(this.Profiles).length === 0) {
			return;
		}
		
		if(this.Queue.length === 0) {
			this.Queue = [...Object.values(this.Profiles)];
			
			if(Config.get('Logging.Plugins.Crawler.Profiles', true)) {
				Logger.info('[Crawler:Profiles]', 'Requeue Profiles.', this.Queue.length);
			}
		}
		
		let user = this.Queue.shift();
		
		if(!user) {
			return;
		}
		
		if(Config.get('Logging.Plugins.Crawler.Profiles', true)) {
			Logger.info('[Crawler:Profiles]', 'Fetch', user);
		}

		try {
			await this.fetchProfile(user);
		} catch(error) {
			Logger.debug('[Crawler:Profiles]', 'Fetch Error', error);
		}
	}
	
	async fetchProfile(user) {
		if(await Database.exists('SELECT `id` FROM `profiles` WHERE `id`=:id AND (`time_updated` IS NULL OR `time_updated` <= (NOW() - INTERVAL 15 MINUTE)) LIMIT 1', {
			id: user.id
		})) {
			if(Config.get('Logging.Plugins.Crawler.Profiles', true)) {
				Logger.danger('[Crawler:Profiles]', 'Ignore', user.nickname);
			}
			
			return;
		}
		
		let profile   = new GraphBuilder(Type.Query, 'GetUserForProfile');
		profile.setAuthSession(this.Client.getSession());
		profile.addFragment('UserForProfile');
		profile.addFragment('ProfileFriendUser');
		profile.addFragment('ProfileCommonFriendUser');
		profile.addFragment('ProfilePictureOverlays');
		profile.setVariable('userId', 		user.id);
		profile.setVariable('pixelDensity', 1);
		
		try {
			const response		= await GraphQL.call(profile);
			let whois			= response.user.user;
			const profileData	= {
				id:				whois.id,
				city:			whois.city,
				readme:			whois.readMe,
				birthday:		Calendar.convertDate(whois.dateOfBirth),
				status:			whois.status,
				hobbies:		JSON.stringify(whois.hobbies),
				music:			JSON.stringify(whois.music),
				movies:			JSON.stringify(whois.movies),
				series:			JSON.stringify(whois.series),
				books:			JSON.stringify(whois.books),
				languages:		JSON.stringify(whois.languages),
				time_updated:	'NOW()'
			};

			if(await Database.exists('SELECT `id` FROM `profiles` WHERE `id`=:id LIMIT 1', {
				id: whois.id
			})) {
				if(Config.get('Logging.Plugins.Crawler.Profiles', true)) {
					Logger.warning('[Crawler:Profiles]', 'Update', user.nickname);
				}
				
				await Database.update('profiles', ['id'], profileData);
			} else {
				if(Config.get('Logging.Plugins.Crawler.Profiles', true)) {
					Logger.success('[Crawler:Profiles]', 'Create', user.nickname);
				}
				
				await Database.insert('profiles', {
					...profileData,
					time_created:	'NOW()',
					time_updated:	null
				});
				
				this.updateStatistics();
			}
		} catch (error) {
			Logger.error('[Crawler:Profiles]', 'FetchProfile Error', error);
		}
	}
}