import GraphBuilder from '../../Classes/Network/GraphBuilder.class.js';
import { GraphQL, Type } from '../../Classes/Network/GraphQL.class.js';
import IPlugin from '../../Classes/IPlugin.interface.js';
import Logger from '../../Classes/Logger.class.js';
import Database from '../../Classes/Database.class.js';
import Calendar from '../../Classes/Utils/Calendar.class.js';

export default class Profiles extends IPlugin {
	Client			= null;
	Channels		= null;
	Profiles		= [];
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
		this.Channels.on('user', (user_id) => {
			this.Profiles.push(user_id);
		});
    }
	
	handleProfileFetch() {
		if(this.Profiles.length === 0) {
			return;
		}
		
		if(this.Queue.length === 0) {
			this.Queue = [...this.Profiles];
			Logger.info('[Crawler:Profiles]', 'Requeue Profiles.', this.Queue.length);
		}
		
		let id = this.Queue.shift();
		
		if(typeof(id) === 'undefined' || id === null) {
			return;
		}
		
		Logger.info('[Crawler:Profiles]', 'Fetch', id);
		this.fetchProfile(id);
	}
	
	async fetchProfile(id) {
		if(!isNaN(parseInt(id))) {
			id = parseInt(id);
		}
		
		if(await Database.exists('SELECT `id` FROM `profiles` WHERE `id`=:id AND (`time_updated` IS NULL OR `time_updated`<=(NOW() - INTERVAL 15 MINUTE)) LIMIT 1', {
			id:	id
		})) {
			Logger.danger('[Crawler:Profiles]', 'Ignore', id);
			return;
		}
		
		let profile   = new GraphBuilder(Type.Query, 'GetUserForProfile');
		profile.setAuthSession(this.Client.getSession());
		profile.addFragment('UserForProfile');
		profile.addFragment('ProfileFriendUser');
		profile.addFragment('ProfileCommonFriendUser');
		profile.addFragment('ProfilePictureOverlays');
		profile.setVariable('userId', 		id);
		profile.setVariable('pixelDensity', 1);
		
		GraphQL.call(profile).then(async (response) => {
			let whois = response.user.user;
			
			if(await Database.exists('SELECT `id` from `profiles` WHERE `id`=:id LIMIT 1', {
				id:	whois.id
			})) {
				Logger.warning('[Crawler:Profiles]', 'Update', id);
				Database.update('profiles', [ 'id' ], {
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
				});
			} else {
				Logger.success('[Crawler:Profiles]', 'Create', id);
				Database.insert('profiles', {
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
					time_created:	'NOW()',
					time_updated:	null
				});
			}				
		}).catch((error) => {
			console.log(error);
		});
	}
}