import Process from 'node:process';
import Logger from './Classes/Logger.class.js';
import Client from './Classes/Client.class.js';
import CurrentServerTime from './Classes/Models/CurrentServerTime.class.js';
import KeepOnlineV2 from './Classes/Models/KeepOnlineV2.class.js';
import Ping from './Classes/Models/Ping.class.js';
import Pong from './Classes/Models/Pong.class.js';

class Main {
    constructor() {
        this.client     = new Client(this);

        // Send Message on CLI typing
        process.stdin.on('data', data => {
            let channel = this.client.getCurrentChannel();

            if(channel === null) {
                this.client.sendSlashCommand(data.toString());
                return;
            }
            
            this.CurrentChannel.sendMessage(data.toString()).catch((error) => {
                console.error(error);
            });
        });

        this.client.on('auth', (error, session) => {
            if(error) {
                Logger.error(error);
                return;
            }

            // Logger.log('ON AUTH', session);
        });

        this.client.on('connect', () => {
            Logger.info('[Bot]', 'Connecting...');
        });

        this.client.on('disconnect', (reason) => {
            Logger.info('[Bot]', 'Disconnecting...', reason);
            this.joinChannel();
        });

        this.client.on('message', (channel, message) => {
            if(message === null) {
                Logger.info('[Message]', 'Reconnected. (Channel: ' + channel.getName() + ')');
                return;
            }

            Logger.info('[Message]', message.getNick() + ' (Channel: ' + channel.getName() + '):', message.toString());
        });

        this.client.on('connected', () => {
            Logger.log('Bot', 'Successfully connected!');
            this.joinChannel();
        });
        
        this.client.on('request', (data) => {
            if(data instanceof Pong) {
                //Logger.log('Bot', 'Request: Pong');
            } else {
                //Logger.log('Bot', 'Request:', data);
            }
        });

        this.client.on('response', (data) => {
            if(data instanceof CurrentServerTime) {
                //Logger.info('[Bot]', 'CurrentServerTime', data.get());
            } else if(data instanceof KeepOnlineV2) {
                //Logger.info('[Bot]', 'KeepOnlineV2', data.get());
            } else if(data instanceof Ping) {
                //Logger.info('[Bot]', 'Ping');
            } else {
                //Logger.info('[Bot]', 'Response', data);
            }
        });
    }

    joinChannel() {
        this.client.getChannel('sys').then((channel) => {
            channel.join().then(() => {
                console.log('[Bot]', 'Joining complete,...');
                console.log('[Bot]', 'Users:', channel.getUsers());
                this.CurrentChannel = channel;

                setTimeout(() => { // Prevent CHANNEL_NOT_FOUND
                    channel.sendMessage('Hello World!').catch((error) => {
                        console.error(error);
                    });
                }, 1000);
            }).catch((error) => {
                Logger.error('[Bot]', 'Can\'t join channel:', error);
            });
        }).catch((error) => {
            Logger.warn('[Bot]', 'Can\'t find Channel:', error);
        });
    }

    getClient() {
        return this.client;
    }
}

new Main();