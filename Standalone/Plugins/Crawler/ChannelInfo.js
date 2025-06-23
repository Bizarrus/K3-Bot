import Config from '../../Classes/Config.class.js';
import GraphBuilder from '../../Classes/Network/GraphBuilder.class.js';
import { GraphQL, Type } from '../../Classes/Network/GraphQL.class.js';
import IPlugin from '../../Classes/IPlugin.interface.js';
import Logger from '../../Classes/Logger.class.js';
import Database from '../../Classes/Database.class.js';
import Calendar from '../../Classes/Utils/Calendar.class.js';

export default class ChannelInfo extends IPlugin {
	StartChannels	= [ 'Knuddels', 'CS', 'Europe' ];
	Client  		= null;
	Channels		= [];
	Channel 		= this.StartChannels[Math.floor(Math.random() * this.StartChannels.length)];
	Queue			= [];
	Watcher			= null;
	Ending			= false;
	PublicMethod	= true;
	
	constructor(client) {
        super();
		
		if(!Config.get('Plugins.Crawler.Enabled', true)) {
			return;
		}
		
		this.Client			= client;
		this.Client.on('topic',				this.onTopic.bind(this));
		this.Client.on('info',				this.onInfo.bind(this));
		this.Client.on('plugin_Channels',	this.onPluginChannels.bind(this));
    }
	
	onPluginChannels(plugin) {
		/* When Channels inited */
		plugin.on('channels', () => {
			this.Channels = plugin.getChannels();
			
			this.Watcher = setInterval(() => {
				this.checkOnline();
			}, 2000);
		});

		/* When new Channel added */
		plugin.on('channel', (channel) => {				
			this.Channels[channel.id] = channel;
		});
	}
	
	onTopic(channel, topic) {
		if(channel.getID().indexOf(':1') !== -1) {
			Database.update('channels', [ 'channel' ], {
				channel:		channel.getID(),
				topic:			JSON.stringify(topic),
				time_updated:	'NOW()'
			});
		}
	}
	
	onInfo(info) {
		if(Config.get('Logging.Plugins.Crawler.ChannelInfo', true)) {
			Logger.info('[Crawler:ChannelInfo]', 'Update Channel-Info', info);
		}
		
		let type		= 'USER';
		let moderators	= [];
		let management	= [];
		let owner		= null;
		let registred	= null;
		
		if(info.isTemporaryChannel) {
			type		= 'TEMP';
		}
		
		if(info.isSystemChannel) {
			type		= 'SYSTEM';	
			moderators	= info.systemChannelInfo[0].cmList;
			management	= info.systemChannelInfo[0].cltList;
		} else {
			owner		= info.myChannelInfo[0].userNick;
			registred	= Calendar.convertToDatetime(info.myChannelInfo[0].timestamp);
			moderators	= info.myChannelInfo[0].mcmList;
		}
		
		Database.update('channels', [ 'name' ], {
			name:			info.channelName,
			category:		info.category,
			stars:			info.channelStars,
			restrictions:	JSON.stringify(info.accessRestrictions),
			info:			JSON.stringify(info.infoMsg),
			users_lc:		info.lcAmount,
			users_hc:		info.hcAmount,
			erotic:			info.isErotic ? 'YES' : 'NO',
			type:			type,
			moderators:		JSON.stringify(moderators),
			management:		JSON.stringify(management),
			owner:			owner,
			time_registred:	registred,
			time_updated:	'NOW()'
		});
	}
	
	checkOnline() {
		const current = this.Client.getCurrentChannel();
		
		if(this.Channel === null) {
			// Continue
		} else if(current === null) {
			this.joinChannel();
			return;
		} else if(!this.PublicMethod && current.getName() !== this.Channel) {
			this.joinChannel();
			return;
		}
		
		setTimeout(() => {
			if(this.Queue.length === 0) {
				this.Queue = [...Object.values(this.Channels)];
				
				if(Config.get('Logging.Plugins.Crawler.ChannelInfo', true)) {
					Logger.info('[Crawler:ChannelInfo]', 'Requeue Channels.', this.Queue.length);
				}
			}
			
			let channel = this.Queue.shift();
			
			if(typeof(channel) === 'undefined' || channel === null) {
				return;
			}
			
			if(this.PublicMethod) {
				if(Config.get('Logging.Plugins.Crawler.ChannelInfo', true)) {
					Logger.info('[Crawler:ChannelInfo]', 'Open /info ' + channel.name);
				}
				
				current.sendMessage('/info ' + channel.name).catch((error) => {});
			} else {
				if(Config.get('Logging.Plugins.Crawler.ChannelInfo', true)) {
					Logger.info('[Crawler:ChannelInfo]', 'Open /opensystemapp ChannelInfoWindowApp');
				}
				
				this.Channel = channel.name;
				current.sendMessage('/opensystemapp ChannelInfoWindowApp').catch((error) => {});
			}
		}, 5000);
	}
	
	async joinChannel() {
		if(!this.Channel) {
			Logger.warn('[Crawler:ChannelInfo]', 'No channel specified to join.');
			return;
		}

		try {
			const channel = await this.Client.getChannel(this.Channel);
			
			try {
				await channel.join(null, true);
				
				if(Config.get('Logging.Plugins.Crawler.ChannelInfo', true)) {
					Logger.info('[Crawler:ChannelInfo]', 'Joining complete:', channel.getName());
				}
			} catch(error) {
				if(Config.get('Logging.Plugins.Crawler.ChannelInfo', true)) {
					this.Channel = null;
					Logger.error('[Crawler:ChannelInfo]', "Can't join channel:", error);
				}
			}
		} catch(response) {
			if(response.hasError && response.hasError('NOT_FOUND')) {
				// Optional: Log oder handle Not-Found Fehler
			}
		}
	}

}