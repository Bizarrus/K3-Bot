import * as Events from 'node:events';
import { clearInterval } from 'node:timers';
import Process  from 'node:process';
import FileSystem from 'node:fs';
import Path from 'node:path';
import ChildProcess from 'node:child_process';

import Logger from './Logger.class.js';
import ClientProperties from './ClientProperties.class.js';
import WebSocket from './Network/WebSocket.class.js';
import Photo from './Network/Photo.class.js';
import { GraphQL, Type } from './Network/GraphQL.class.js';
import SessionInfo from './Models/SessionInfo.class.js';
import GraphBuilder from './Network/GraphBuilder.class.js';
import Config from './Config.class.js';
import SessionStorage from './SessionStorage.class.js';
import Auth from './Network/Auth.class.js';
import AuthSession from './Models/AuthSession.class.js';
import CurrentServerTime from './Models/CurrentServerTime.class.js';
import KeepOnlineV2 from './Models/KeepOnlineV2.class.js';
import User from './Models/User.class.js';
import Ping from './Models/Ping.class.js';
import Pong from './Models/Pong.class.js';
import Notification from './Subscriptions/Notification.class.js';
import ClientSettings from './Subscriptions/ClientSettings.class.js';
import ChannelEvents from './Subscriptions/ChannelEvents.class.js';
import AppEvents from './Subscriptions/AppEvents.class.js';
import SystemEvents from './Subscriptions/SystemEvents.class.js';
import AdFreeAcquired from './Subscriptions/AdFreeAcquired.class.js';
import HappyMomentEvents from './Subscriptions/HappyMomentEvents.class.js';
import Channel from './Models/Channel.class.js';
import Messenger from './Models/Messenger.class.js';
import Text from './Utils/Text.class.js';

export const FeatureFlag = {
    EngagementSystemChatGroup:              580,
    TanSystemEnabled:                       585,
    NickSwitch:                             594,
    Authenticity:                           599,
    SmileyTrade:                            610,
    DisablePeriodicChannelSelectionUpdates: 649,
    NewAppKnuddelTransfer:                  656
};

export default class Client extends Events.EventEmitter {
    Core            = null;
    AuthSession     = null;
    Subscriptions   = null;
    User            = null;
    CurrentChannel  = null;
    Messenger       = null;
    Channels        = {};
    FeatureFlags    = [];
    Plugins         = {};
    _Health_Watcher = null;

    constructor(core) {
        super();

        this.Core           = core;
        this.Messenger      = new Messenger(this);
        
        Process.on('unhandledRejection', (reason, p) => {
            console.error('[Error]', 'Unhandled Rejection at:', p, 'reason:', reason, reason.stack);
        });

        Process.on('uncaughtException', (error) => {
            console.error('[Error]', `Caught exception: ${error}\n` + `Exception origin: ${error.stack}`);
        });

        Process.on('SIGINT', () => {
            console.log('[Client] Exit');
            // @ToDo send Disconnect & co

            /* Leave Channel */
            /*let graph = new GraphBuilder(Type.Mutation, 'LeaveChannel');
            graph.setAuthSession(this.AuthSession);
           
            GraphQL.call(graph).then((response) => {
                Process.exit(-1);
            });*/

            /* Exit after 5 Seconds if not already shutted down */
            setTimeout(() => {
                Process.exit(-1);
            }, 1000);
        });

        this.loadPlugins();

        this.on('auth', (error) => {
            if(error) {
                return;
            }

            let graph;

            /* Get FeatureFlags */
            graph = new GraphBuilder(Type.Query, 'GetFeatureFlags');
            graph.setAuthSession(this.AuthSession);
           
            GraphQL.call(graph).then((response) => {
                response.featureFlags.enabledFlags.forEach((flag) => {
                    this.FeatureFlags.push(flag.id);
                });
            }).catch((error) => {
                console.error('[Client] Can\'t fetch FeatureFlags:', error);
            });

            /* Get current Nick */
            graph = new GraphBuilder(Type.Query, 'GetCurrentUserNick');
            graph.addFragment('ProfilePictureOverlays');
            graph.setAuthSession(this.AuthSession);
            GraphQL.call(graph).then((response) => {
                this.User = new User(response.user.currentUser);
            }).catch((error) => {
                console.error('[Client] Can\'t fetch Current User:', error);
            });

            /* Set initial Join */
            graph = new GraphBuilder(Type.Mutation, 'InitialJoin');
            graph.addFragment('ActiveChannel');
            graph.addFragment('ChannelJoinError');
            graph.addFragment('ChannelUser');
            graph.addFragment('Color');
            graph.setVariable('force', false); /* Disable Autologin,.. */
            graph.setVariable('pixelDensity', 1);
            graph.setAuthSession(this.AuthSession);
            GraphQL.call(graph).then((response) => {}).catch((error) => {
                console.error('[Client] Can\'t fetch Initial Join:', error);
            });
        });

        /* Global Register your Subscriptions */
        this.on('connected', () => {
            this.addSubscription(new Notification, (data) => {
                this.emit('notification', data);
            });

            this.addSubscription(new ClientSettings, (data) => {
                console.log('[Client]', 'ClientSettings', data);
            });

            this.addSubscription(new AppEvents, (data) => {
                switch(data.appId) {
                    // Quests
                    case 'EngagementSystemApp':
                        switch(data.eventKey) {
                            case '__fetchEventResponse':
                            case 'profilePictureChanged':
                            case 'overviewStateChanged':
                                /* Do Nothing */
                                // JSON.parse(data.eventValue);
                            break;
                            default:
                                try {
                                    let pageData    = JSON.parse(data.pageData);
                                    let dataUrl     = pageData.config.pageDataLoadUrl;
            
                                    if(dataUrl.startsWith('data:,')) {
                                        let quests = JSON.parse(decodeURIComponent(escape(atob(dataUrl.substring(6)))));
            
                                        this.emit('quests', quests.overview.tasks);
                                    }
                                } catch(e) {
                                    console.error(e, data)
                                }
                            break;
                        }
                    break;

                    // Weltreise
                    case 'worldtour':
                        /* Do Nothing */
                    break;

                    // Photo Upload
                    case 'ProfileCustomizationApp':
                        /* Do Nothing */
                    break;
                    default:
                        console.log('[Client]', 'AppEvents', data);
                    break;
                }
            });
            
            this.addSubscription(new AdFreeAcquired, (data) => {
                console.log('[Client]', 'AdFreeAcquired', data);
            });
            
            this.addSubscription(new HappyMomentEvents, (data) => {
                console.log('[Client]', 'HappyMomentEvents', data);
            });

            this.addSubscription(new ChannelEvents, (data) => {
                let id = null;

                if(typeof(data.channel.id) !== 'undefined') {
                    if(data.channel.id.indexOf(':') === -1) {
                        id = data.channel.id + ':1';
                    } else {
                        id = data.channel.id;
                    }
                }

                if(id === null) {
                    console.log('[Client]', 'Unknown Channel-ID', id, data);                    
                } else if(typeof(this.Channels[id]) !== 'undefined') {
                    let channel = this.Channels[id];

                    if(typeof(data.msg) !== 'undefined' && data.msg !== null) {
                        this.emit('message', channel, new Text(data.msg));
                    } else {
                        this.emit('message', channel, null);
                    }
                } else {
                    console.log('[Client]', 'ChannelEvents', data);
                }
            });

            this.addSubscription(new SystemEvents, (data) => {
                switch(data.__typename) {
                    case 'ClientDisconnected':
                        switch (data.disconnectReason.__typename) {
                            case 'ClientDisconnectReasonUserDeleted':
                                this.emit('disconnect', 'LOGOUT');
                            break;
                            case 'ClientDisconnectReasonNicknameChanged':
                                this.emit('disconnect', 'CHANGE_NICKNAME', data.disconnectReason.newNick);
                            break;
                            default:
                                // refresh session to check for errors with the chatserver connection.
                                this.emit('disconnect', 'REFRESH_SESSION');
                            break;
                        }
                    break;
                    case 'ChannelConnectionDisconnected':
                        /*if(this.activeChannelService.state.kind !== 'active') {
                            // Don't need/want to trigger disconnects or clear channel if it is not active.
                            // E.g. We don't want to transition into the disconnected modal when we left the channel previously
                            return;
                        }*/

                        switch(data.newReason) {
                            case 'OTHER_SESSION_CONNECTED':
                                this.emit('disconnect', 'OTHER_SESSION_CONNECTED');
                                //console.warn('[Client]', 'Another session has connected to the channel.');
                            break;
                            case 'INTERNAL':
                                this.emit('disconnect', 'INTERNAL');
                                //console.warn('[Client]', 'A not specifically handled reason for the disconnect. The client may assume that this kind of disconnect is not intended by the user.');    
                            break;
                            case 'USER_LEAVE':
                                // this event should only arrive for the current session that left the channel.
                                // and since we already clear the channel in the mutation we don't need to do anything here.
                                this.emit('disconnect', 'USER_LEAVE');
                                //console.warn('[Client]', 'The user closed the channel connection on his own volition.');
                            break;
                        }
                    break;
                    case 'OpenUrl':
                        ChildProcess.exec((Process.platform == 'darwin'? 'open': Process.platform == 'win32'? 'start': 'xdg-open') + ' ' + data.url);
                    break;
                    default:
                        console.log('SystemEvents', data);
                    break;
                }
            });
        });

        this.checkClientProperties().then(() => {
            this.Subscriptions  = new WebSocket(this);
    
            this.connect();
        }).catch((error) => {
            console.error(error);
        });
    }

    connect() {
        /* Get current ServerTime */
        GraphQL.call(new GraphBuilder(Type.Query, 'CurrentServerTime')).then((response) => {
            this.emit('response', new CurrentServerTime(response.currentTime))
        }).catch((error) => {
            console.error('[Client] Can\'t fetch Current Server Time:', error);
        });
        
        /* Login */
        this.login().then(() => {
            if(this._Health_Watcher) {
                clearInterval(this._Health_Watcher);
            }
    
            /* Create Health-Check*/
            this._Health_Watcher = setInterval(() => {
                let query = new GraphBuilder(Type.Mutation, 'KeepOnlineV2');
                query.setVariable('clientState', 'Active');
                query.setAuthSession(this.AuthSession);
    
                GraphQL.call(query).then((response) => {
                    switch(response.user.keepOnlineV2.__typename) {
                        case 'KeepOnlineSuccess':
                            this.emit('response', new KeepOnlineV2(true));
                        break;
                        case 'KeepOnlineError':
                            this.emit('response', new KeepOnlineV2(false));
                        break;
                    }
                }).catch((error) => {
                    console.error('[Client] Can\'t fetch Keep Online:', error);
                });
            }, Config.get('connection.heartbeat', 60000));
        }).catch((error) => {
            console.error(error);
        });
    }

    login(force) {
        if(typeof(force) === 'undefined') {
            force = false;
        }

        return new Promise((resolve, failure) => {
            let user = Config.getUser(0);

            if(Config.get('storage.sessions', true) && SessionStorage.exists(user.nickname) && !force) {
                this.AuthSession = SessionStorage.get(user.nickname);

                if(this.AuthSession === null || this.AuthSession.isExpired()) {
                    /* Do Nothing */
                } else {
                    this.Subscriptions.connect();
                    this.emit('auth', null, this.AuthSession);
                    return;
                }
            }

            new Auth(user.nickname, user.password).then((token) => {
                this.refreshSession(token).then((state) => {
                    resolve();

                    if(Config.get('storage.sessions', true)) {
                        SessionStorage.update(user.nickname, this.AuthSession);
                    }

                    this.Subscriptions.connect();
                    this.emit('auth', null, this.AuthSession);
                }).catch((error) => {
                    failure(error);
                    this.emit('auth', error, null);
                });
            }).catch((error) => {
                failure(error);
                this.emit('auth', error, null);
            });
        });
    }

    getCurrentChannel() {
        return this.CurrentChannel;
    }

    setCurrentChannel(channel) {
        this.CurrentChannel = channel;
    }

    getCurrentUser() {
        return this.User;
    }

    getSession() {
        return this.AuthSession;
    }

    getMessenger() {
        return this.Messenger;
    }

    refreshSession(token) {
        return new Promise((success, failure) => {
            if(this.AuthSession !== null && !this.AuthSession.isExpired()) {
                success(false);
                return;
            }

            let graph = new GraphBuilder(Type.Query, 'RefreshSessionToken');
            graph.setAuthToken(token);
            graph.addFragment('RefreshSessionError');
            graph.addFragment('UserWithLockInfo');
            graph.setVariable('sessionInfo', new SessionInfo());
    
            GraphQL.call(graph).then((response) => {
                if(this.AuthSession === null) {
                    this.AuthSession = new AuthSession({
                        expiry:     response.login.refreshSession.expiry,
                        login:      token,
                        connection: response.login.refreshSession.token
                    });

                    this.AuthSession.on('expired', (state) => {
                        this.emit('auth', 'Session Expired!', null);
                        this.login(true);
                    });
                } else {
                    this.AuthSession.update({
                        expiry:     response.login.refreshSession.expiry,
                        login:      token,
                        connection: response.login.refreshSession.token
                    });
                }

                success(true);
            }).catch(failure);
        });       
    }

    addSubscription(clazz, callback) {
        this.Subscriptions.addSubscription(clazz, callback);
    }

    checkClientProperties() {
        return new Promise((success, failure) => {
            if(ClientProperties.exists()) {
                success();
                return;
            }
            
            ClientProperties.resolve().then(() => {
                success();
            }).catch(failure);
        });
    }

    getChannel(channelname) {
        return new Promise((success, failure) => {
            let graph = new GraphBuilder(Type.Query, 'ExactMatchChannelSearch');
            graph.addFragment('SearchChannelGroup');
            graph.addFragment('SearchChannelGroupInfo');
            graph.addFragment('ChannelGroupInfo');
            graph.addFragment('Color');
            graph.addFragment('ChannelPreviewMembers');
            graph.addFragment('ChannelListContact');           
            graph.setVariable('searchText', channelname);
            graph.setVariable('pixelDensity', 1);
            graph.setAuthSession(this.AuthSession);

            GraphQL.call(graph).then((response) => {
                try {
                    if(response.channel.channelGroup === null) {
                        console.log(response);
                        failure('Empty Channel-Response.');
                        return;
                    }

                    let id      = response.channel.channelGroup.id;
                    let name    = response.channel.channelGroup.name;
                    let image   = response.channel.channelGroup.info.previewImageUrl;
                    let color   = response.channel.channelGroup.info.backgroundColor;
                    let channel = new Channel(this);
                    
                    if(id.indexOf(':') === -1) {
                        id = id + ':1';
                    }

                    channel.init(id, name);
                    channel.setTopic(response.channel.channelGroup.info.shortDescription);
                    channel.setStyle(image, [
                        color.red,
                        color.green,
                        color.blue,
                        color.alpha
                    ]);

                    this.Channels[channel.getID()]  = channel;
                    let found                       = false;

                    response.channel.channelGroup.channels.forEach((subentry) => {
                        let subchannel = channel.addSubchannel(subentry.id, subentry.name);

                        this.Channels[subchannel.getID()] = subchannel;
                    });

                    if(channelname === channel.getName()) {
                        success(channel);
                        found = true;
                    } else {
                        channel.getSubchannels().forEach((c) => {
                            if(channelname === c.getName()) {
                                success(c);
                                found = true;
                            }
                        });
                    }

                    if(!found) {
                        failure(channelname + ' not found.');
                    }
                } catch(e) {
                    console.error("getChannel-Error:", e, response);
                }
            }).catch(failure);
        });
    }

    getChannels() {
        return new Promise((success, failure) => {
            let graph = new GraphBuilder(Type.Query, 'GetChannelListOverview');
            graph.addFragment('ChannelAd');
            graph.addFragment('ChannelGroupInfo');
            graph.addFragment('Color');
            graph.addFragment('ChannelCategory');
            graph.addFragment('ChannelListContact');
            graph.addFragment('ChannelGroup');
            graph.addFragment('Channel');
            graph.addFragment('ChannelPreviewMembers');            
            graph.setVariable('groupAmount', 99999);
            graph.setVariable('pixelDensity', 1);
            graph.setAuthSession(this.AuthSession);
    
            let channels = [];

            GraphQL.call(graph).then((response) => {
                response.channel.categories.forEach((category) => {
                    category.channelGroups.forEach((entry) => {
                        let subchannels = [];

                        entry.channels.forEach((subentry) => {
                            subchannels.push({
                                id:     subentry.id,
                                name:   subentry.name
                            });
                        });

                        channels.push({
                            id:             parseInt(entry.id),
                            name:           entry.name,
                            style:          {
                                image:  entry.info.previewImageUrl,
                                color:  [
                                    entry.info.backgroundColor.red,
                                    entry.info.backgroundColor.green,
                                    entry.info.backgroundColor.blue,
                                    entry.info.backgroundColor.alpha
                                ].join(','),
                                topic:  entry.info.shortDescription
                            },
                            channels:       subchannels
                        });
                    });
                });

                success(channels);
            }).catch(failure);
        });
    }

    sendSlashCommand(command) {
        return new Promise((success, failure) => {
            let graph = new GraphBuilder(Type.Mutation, 'SendSlashCommand');
            graph.setAuthSession(this.AuthSession);
            graph.setVariable('event',  {
                command: command
            });
    
            GraphQL.call(graph).then((response) => {
                console.log(response);
                success();
            }).catch(failure);
        });
    }
	
    loadPlugins() {
		FileSystem.readdir('./Plugins', { withFileTypes: true }, (error, entries) => {
			if(error) {
				console.error('[Plugin]', 'Error on Plugin-Loader:', error);
				return;
			}

			entries.forEach((entry) => {
				if(entry.isDirectory()) {
					const pluginName = entry.name;
					const pluginPath = Path.resolve(process.cwd(), 'Plugins', pluginName);

					FileSystem.readdir(pluginPath, {
						withFileTypes: true
					}, (e, plugins) => {
						if(e) {
							console.error('[Plugin]', 'Error on Plugin-Loader:', e);
							return;
						}

						plugins.forEach((plugin) => {
							this.loadPlugin(plugin);
						});
					});
				} else {
					this.loadPlugin(entry);
				}
			});
		});
    }

	async loadPlugin(file) {
		let path        = null;
		let path_root   = Path.resolve(process.cwd(), file.parentPath, file.name);

		if(FileSystem.existsSync(path_root)) {
			path = path_root;
		}

		if(path === null) {
			console.error('[Plugin]', 'Can\'t find Plugin-Class from', file);
			return;
		}

		try {
			let Clazz							= await import('file:///' + path, {});
			this.Plugins[Clazz.default.name]	= new Clazz.default(this);
		} catch(error) {
			console.error('[Plugin]', file, path, error);
		}
	}
	
	getPlugins() {
		return this.Plugins;
	}
	
	getPlugin(name) {
		if(typeof(this.Plugins[name]) === 'undefined') {
			return null;
		}
		
		return this.Plugins[name];
	}
}