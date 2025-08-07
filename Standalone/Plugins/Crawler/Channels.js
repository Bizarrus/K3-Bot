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
		
		if(!Config.get('Plugins.Crawler.Enabled', true)) {
			return;
		}
		
		Database.fetch('SELECT `id`, `nickname` FROM `users` ORDER BY `time_updated` IS NOT NULL, `time_updated` ASC').then((results) => {
			for(const {
				id,
				nickname
			} of results) {
				const parsedId = parseInt(id, 10);
				
				if(!this.Profiles[parsedId]) {
					this.Profiles[parsedId] = {
						id: parsedId,
						nickname
					};
				}
			}
			
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.info('[Crawler:Channels]', 'Loaded', Object.keys(this.Profiles).length, 'User-ID\'s from Database.');
			}
			
			this.emit('users');
		});
		
		this.updateMemberStatistics();
		
		Database.fetch('SELECT `channel`, `name`, `time_updated` FROM `channels` WHERE `time_deleted` IS NULL ORDER BY `time_updated` IS NOT NULL, `time_updated` ASC').then((results) => {
			for(const {
				channel,
				name,
				time_updated
			} of results) {
				if(!this.Channels[channel]) {
					this.Channels[channel] = {
						id: channel,
						name,
						time_updated: (time_updated === null ? new Date('1970-01-01T00:00:00.000Z') : new Date(time_updated))
					};
				}
			}
			
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.info('[Crawler:Channels]', 'Loaded', Object.keys(this.Channels).length, 'Channels from Database.');
			}
			
			this.emit('channels');
		});
		
		this.updateChannelStatistics();
			
		this.Client.on('connected', () => {
			this.fetchChannels().then(async (channels) => {
				for(const channel of channels) {
					await this.addChannel(channel);
				}
				
				this.Watcher = setInterval(() => {
					this.getChannelMembers();
				}, 1000);
			}).catch((error) => {
				console.log(error);
			});
		});
    }
	
	async updateChannelStatistics() {
		let statistics	= await Database.single('SELECT COUNT(*) AS `total` FROM (SELECT REPLACE (`channels`.`channel`, \':1\', \'\') AS `channel_id` FROM `channels` WHERE `channels`.`channel` LIKE \'%:1\' AND `time_deleted` IS NULL GROUP BY REPLACE (`channels`.`channel`, \':1\', \'\')) AS `channels`');
		
		await Database.update('statistics', [ 'name' ], {
			name:	'channels',
			value:	statistics.total
		});		
	}
	
	async updateMemberStatistics() {
		let statistics	= await Database.single(`SELECT
			COUNT(id) AS users,
			SUM(CASE WHEN gender = 'MALE' THEN 1 ELSE 0 END) AS male,
			SUM(CASE WHEN gender = 'FEMALE' THEN 1 ELSE 0 END) AS female,
			SUM(CASE WHEN gender = 'NONBINARY_HE' THEN 1 ELSE 0 END) AS binary_he,
			SUM(CASE WHEN gender = 'NONBINARY_SHE' THEN 1 ELSE 0 END) AS binary_she,
			SUM(CASE WHEN gender = 'UNKNOWN' THEN 1 ELSE 0 END) AS unknown
		FROM users;`);
		
		for(let name in statistics) {
			await Database.update('statistics', [ 'name' ], {
				name:	name,
				value:	statistics[name]
			});
		}
	}
	
	async addChannel(channel) {
		if(!channel.id.endsWith(':1')) {
			Database.delete('channels', {
				channel: channel.id
			});
			return;
		}
		
		if(await Database.exists('SELECT `id` from `channels` WHERE `channel`=:id LIMIT 1', {
			id:	channel.id
		})) {
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.warning('[Channel]', 'Update', channel.name);
			}
			
			await Database.update('channels', [ 'channel' ], {
				channel:		channel.id,
				name:			channel.name,
				time_updated:	'NOW()'
			});
		} else {
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.success('[Channel]', 'Create', channel.name);
			}
			
			await Database.insert('channels', {
				id:				null,
				channel:		channel.id,
				name:			channel.name,
				time_created:	'NOW()',
				time_updated:	null
			});
			
			this.updateChannelStatistics();
		}
		
		if(!this.Channels[channel.id]) {
			this.Channels[channel.id] = {
				id:				parseInt(channel.id),
				name:			channel.name,
				time_updated:	new Date()
			};

			this.emit('channel', this.Channels[channel.id]);
		}
	}
	
	async fetchChannels() {
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
				success(response.channel.categories.flatMap(category =>
					category.channelGroups.flatMap(group => group.channels)
				));
			}).catch(failure);
		});
	}
	
	async getChannelMembers() {
		if(!Object.keys(this.Channels).length) {
			return;
		}
		
		if(!this.Queue.length) {
			this.Queue = Object.values(this.Channels).sort((a, b) => {
				const timeA	= a.time_updated ? new Date(a.time_updated).getTime() : 0;
				const timeB	= b.time_updated ? new Date(b.time_updated).getTime() : 0;
				
				return timeA - timeB;
			});

			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.info('[Crawler:Channels]', 'Requeue Channels.', this.Queue.length);
			}
		}

		const channel = this.Queue.shift();

		if(!channel) {
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
		
		GraphQL.call(request).then(async (response) => {
			this.updateChannel(channel, response.channel.channel.groupInfo);
			
			for(const user of response.channel.channel.users) {
				await this.addNickname(user);
			}
		}).catch((error) => {
			if(error.hasError('NOT_FOUND')) {
				Logger.error('[Crawler:Channels]', 'Channel ', channel.name, ' (' + channel.id + ') not exists');
				Database.update('channels', [ 'channel' ],  {
					channel:		channel.id,
					time_deleted:	'NOW()'
				});
				this.Channels[channel.id] = null;
			} else {
				Logger.debug('Exception', error);
			}
			
			//process.exit(0);
		});
	}
	
	async updateChannel(channel, info) {
		if(!channel.id.endsWith(':1')) {
			return;
		}
		
		await Database.update('channels', [ 'channel' ], {
			channel:			channel.id,
			name:				channel.name,
			background:			(info.backgroundImageInfo === null ? null : JSON.stringify(info.backgroundImageInfo)),
			color_background:	JSON.stringify(info.backgroundColor),
			color_highlight:	JSON.stringify(info.highlightColor),
			time_updated:		'NOW()'
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
		
		const userCheck = await Database.single(`SELECT
			id, 
			(time_updated IS NULL OR time_updated <= (NOW() - INTERVAL 1 DAY)) AS outdated
		FROM
			users 
		WHERE
			id=:id
		LIMIT 1`, {
			id: user.id
		});

		if(!userCheck) {
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.success('[Crawler:User]', 'Create', user.nick);
			}
			
			await Database.insert('users', {
				id:				user.id,
				nickname:		user.nick,
				age:			user.age,
				gender:			user.gender,
				time_created:	'NOW()',
				time_updated:	null
			});
		} else if(userCheck.outdated) {
			if(Config.get('Logging.Plugins.Crawler.Channels', true)) {
				Logger.warning('[Crawler:User]', 'Update', user.nick);
			}
			
			await Database.update('users', [ 'id' ], {
				id:				user.id,
				nickname:		user.nick,
				age:			user.age,
				gender:			user.gender,
				time_updated:	'NOW()'
			});
		}
		
		const id = parseInt(user.id);
		
		if(typeof(this.Profiles[id]) === 'undefined') {
			this.Profiles[id] = {
				id:			id,
				nickname:	user.nick
			};
			
			this.emit('user', this.Profiles[id]);
		}
		
		this.updateMemberStatistics();
	}
	
	getChannels() {
		return this.Channels;
	}
	
	getUsers() {
		return this.Profiles;
	}
}