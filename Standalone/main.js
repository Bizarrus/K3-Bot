import Process from 'node:process';
import Logger from './Classes/Logger.class.js';
import Config from './Classes/Config.class.js';
import Client from './Classes/Client.class.js';
import CurrentServerTime from './Classes/Models/CurrentServerTime.class.js';
import KeepOnlineV2 from './Classes/Models/KeepOnlineV2.class.js';
import Ping from './Classes/Models/Ping.class.js';
import Pong from './Classes/Models/Pong.class.js';

class Main {
    constructor() {
        this.client     = new Client(this);

        this.client.on('auth', (error, session) => {
            if(error) {
                Logger.error(error);
                return;
            }
        });

        this.client.on('connect', () => {
            Logger.info('[Bot]', 'Connecting...');
        });

        this.client.on('disconnect', (reason) => {
            Logger.info('[Bot]', 'Disconnecting...', reason);
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
        });
        
        this.client.on('request', (data) => {
			if(Config.get('Logging.Request', false)) {
				if(data instanceof Pong) {
					Logger.log('Bot', 'Request: Pong');
				} else {
					Logger.log('Bot', 'Request:', data);
				}
			}
        });

        this.client.on('response', (data) => {
            if(data instanceof CurrentServerTime) {
               // Logger.info('[Bot]', 'CurrentServerTime', data.get());
            } else if(data instanceof KeepOnlineV2) {
               // Logger.info('[Bot]', 'KeepOnlineV2', data.get());
            } else if(data instanceof Ping) {
                //Logger.info('[Bot]', 'Ping');
            } else {
                //Logger.info('[Bot]', 'Response', data);
           
				if(typeof(data.response) !== 'undefined') {
					Logger.debug('ERRORS', data.response);
				}
			}			
        });
    }

    getClient() {
        return this.client;
    }
}

new Main();