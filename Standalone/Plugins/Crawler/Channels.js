import Config from '../../Classes/Config.class.js';
import GraphBuilder from '../../Classes/Network/GraphBuilder.class.js';
import { GraphQL, Type } from '../../Classes/Network/GraphQL.class.js';
import IPlugin from '../../Classes/IPlugin.interface.js';
import Logger from '../../Classes/Logger.class.js';
import Database from '../../Classes/Database.class.js';
import Calendar from '../../Classes/Utils/Calendar.class.js';

export default class Channels extends IPlugin {
	Client			= null;
	Channels		= {};
	Profiles		= {};
	Queue			= [];
	Watcher			= null;
	
    constructor(client) {
        super();
		this.Client = client;
		
		Database.fetch('SELECT `id`, `nickname` FROM `users` ORDER BY `time_updated` ASC').then((results) => {
			results.forEach((result) => {
				if(typeof(this.Profiles[parseInt(result.id)]) === 'undefined') {
					this.Profiles[parseInt(result.id)] = {
						id:			parseInt(result.id),
						nickname:	result.nickname
					};
				}
			});
			
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.info('[Crawler:Channels]', 'Loaded', Object.keys(this.Profiles).length, 'User-ID\'s from Database.');
			}
			
			this.emit('users');
		});
		
		Database.fetch('SELECT `channel`, `name` FROM `channels` ORDER BY `time_updated` ASC').then((results) => {
			results.forEach((result) => {
				if(typeof(this.Channels[result.channel]) === 'undefined') {
					this.Channels[result.channel] = {
						id:		result.channel,
						name:	result.name
					};
				}
			});
			
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.info('[Crawler:Channels]', 'Loaded', Object.keys(this.Channels).length, 'Channels from Database.');
			}
		});
		
		this.Client.on('connected', () => {
			this.getChannels().then((channels) => {
				channels.forEach((channel) => {
					this.addChannel(channel);
				});
				
				this.Watcher = setInterval(() => {
					this.getChannelMembers();
				}, 1000);
			}).catch((error) => {
				console.log(error);
			});
		});
    }
	
	async addChannel(channel) {
		if(await Database.exists('SELECT `id` from `channels` WHERE `channel`=:id LIMIT 1', {
			id:	channel.id
		})) {
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.warning('[Channel]', 'Update', channel.name);
			}
			
			Database.update('channels', [ 'channel' ], {
				channel:		channel.id,
				name:			channel.name,
				time_updated:	'NOW()'
			});
		} else {
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.success('[Channel]', 'Create', channel.name);
			}
			
			Database.insert('channels', {
				id:				null,
				channel:		channel.id,
				name:			channel.name,
				time_created:	'NOW()',
				time_updated:	null
			});
		}
		
		if(typeof(this.Channels[channel.id]) === 'undefined') {
			this.Channels[channel.id] = {
				id:		channel.id,
				name:	channel.name
			};
		}
	}
	
	async getChannels() {
		return new Promise(async (success, failure) => {
			let results		= [];
			let channels	= new GraphBuilder(Type.Query, 'GetChannelListOverview');
			
			channels.setAuthSession(this.Client.getSession());
			channels.addFragment('ChannelAd');
			channels.addFragment('ChannelCategory');
			channels.addFragment('ChannelGroupInfo');
			channels.addFragment('ChannelGroup');
			channels.addFragment('Color');
			channels.addFragment('Channel');
			channels.addFragment('ChannelListContact');
			channels.addFragment('ChannelPreviewMembers');
			channels.setVariable('groupAmount',		9999999);
			channels.setVariable('pixelDensity',	1);
			
			return GraphQL.call(channels).then((response) => {
				response.channel.categories.forEach((categories) => {
					categories.channelGroups.forEach((group) => {
						group.channels.forEach((room) => {
							results.push(room);
						});	
					});
				});
				
				success(results);
			}).catch(failure);
		});
	}
	
	async getChannelMembers() {
		if(Object.keys(this.Channels).length === 0) {
			return;
		}
		
		if(this.Queue.length === 0) {
			this.Queue = [...Object.values(this.Channels)];
			
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.info('[Crawler:Channels]', 'Requeue Channels.', this.Queue.length);
			}
		}
		
		let channel = this.Queue.shift();
		
		if(typeof(channel) === 'undefined' || channel === null) {
			return;
		}
		
		if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
			Logger.info('[Crawler:Channel]', 'Fetch', channel);
		}
		
		let request   = new GraphBuilder(Type.Query, 'GetChannel');
		request.setAuthSession(this.Client.getSession());
		request.addFragment('ActiveChannel');
		request.addFragment('ChannelUser');
		request.addFragment('Color');
		request.setVariable('channelId', channel.id);
		
		GraphQL.call(request).then((response) => {
			response.channel.channel.users.forEach(async (user) => {
				this.addNickname(user);
			});
		}).catch((error) => {
			console.log(error);
		});
	}
	
	async addNickname(user) {
		if(!(await Database.exists('SELECT `id` from `visits` WHERE `user`=:id AND `date`=:date LIMIT 1', {
			id:		user.id,
			date:	Calendar.getDate()
		}))) {
			Database.insert('visits', {
				id:		null,
				user:	user.id,
				date:	Calendar.getDate()
			});
		}
		
		// Nick-Cache age = 1 day renewal
		if(!(await Database.exists('SELECT `id` FROM `users` WHERE `id`=:id AND (`time_updated` IS NULL OR `time_updated`<=(NOW() - INTERVAL 1 DAY)) LIMIT 1', {
			id:	user.id
		}))) {
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.danger('[Crawler:User]', 'Ignore', user.id);
			}
			
			return;
		}
		
		if(await Database.exists('SELECT `id` from `users` WHERE `id`=:id LIMIT 1', {
			id:	user.id
		})) {
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.warning('[Crawler:User]', 'Update', user.nick);
			}
			
			Database.update('users', [ 'id' ], {
				id:				user.id,
				nickname:		user.nick,
				age:			user.age,
				gender:			user.gender,
				time_updated:	'NOW()'
			});
		} else {
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.success('[Crawler:User]', 'Create', user.nick);
			}
			
			Database.insert('users', {
				id:				user.id,
				nickname:		user.nick,
				age:			user.age,
				gender:			user.gender,
				time_created:	'NOW()',
				time_updated:	null
			});
		}
		
		if(typeof(this.Profiles[parseInt(user.id)]) === 'undefined') {
			this.Profiles[parseInt(user.id)] = {
				id:			parseInt(user.id),
				nickname:	user.nick
			};
			
			this.emit('user', this.Profiles[parseInt(user.id)]);
		}
	}
	
	getUsers() {
		return this.Profiles;
	}
}