import WebSocketClient from 'ws';
import Crypto from 'node:crypto';
import ClientProperties from '../ClientProperties.class.js';
import Logger from '../Logger.class.js';
import ClientVersion from '../Models/ClientVersion.class.js';
import Ping from '../Models/Ping.class.js'
import Pong from '../Models/Pong.class.js';

export default class WebSocket  {
    Socket          = null;
    Client          = null;
    Cookies         = {};
    Subscriptions   = {};

    constructor(client) {
        this.Client     = client;
    }

    init() {
        this.Cookies['de__knJwt']               = this.Client.getSession().getConnectionToken();
        this.Cookies['de__lastUsedDeviceToken'] = this.Client.getSession().getConnectionToken();
        this.Cookies['knJwt']                   = this.Client.getSession().getConnectionToken();

        this.Socket = new WebSocketClient(ClientProperties.get('urls.subscription'), {
            origin:     ClientProperties.get('urls.origin'),
            headers:    {
                'accept':       '*/*',
                'user-agent':   ClientProperties.get('browser.useragent'),
                'cookie':       this.getCookies()
            }
        });
    }

    getCookies() {
        let string = [];

        Object.keys(this.Cookies).forEach((name) => {
            let value = this.Cookies[name];
            string.push(name + '=' + value);
        });

        return string.join(';');
    }

    connect() {
        this.init();

        this.Socket.on('error', console.error);

        this.Socket.on('open', () => {
            this.Client.emit('connect');

            this.send({
                type:       'connection_init',
                payload:    {
                    Authorization:  'Bearer ' + this.Client.getSession().getConnectionToken(),
                    ClientVersion:  new ClientVersion().getVersion()
                }
            });
        });

        this.Socket.on('close', () => {
            Logger.warn("CLOSE");
        });

        this.Socket.on('message', (data) => {
            let json    = JSON.parse(data);
            let id      = json.id;

            switch(json.type) {
                /* Connection Successfull */
                case 'connection_ack':
                    this.Client.emit('connected');
                break;
                case 'complete':
                    this.Client.emit('response', json);

                    if(typeof(this.Subscriptions[id]) === 'undefined') {
                        Logger.warn('Unknown ID:', id);
                    } else if(typeof(json.payload.errors) !== 'undefined') {
                        Logger.error(this.Subscriptions[id], json.payload.errors);
                    } else {
                        this.Subscriptions[id].callback(json.payload);
                    }
                break;
                case 'next':
                    if(typeof(this.Subscriptions[id]) === 'undefined') {
                        Logger.warn('Unknown ID:', id);
                        this.Client.emit('response', json);
                    } else if(typeof(json.payload.errors) !== 'undefined') {
                        Logger.error(this.Subscriptions[id], json.payload.errors);
                        this.Client.emit('response', json);
                        return;
                    } else {
                        if(typeof(this.Subscriptions[id].class.parse) !== 'undefined') {
                            json = this.Subscriptions[id].class.parse(json);
                        }

                        this.Subscriptions[id].callback(json);
                        this.Client.emit('response', json);
                    }
                break;
                case 'ping':
                    this.Client.emit('response', new Ping);
                    this.send(new Pong);
                break;
                default:
                    this.Client.emit('response', json);
                    Logger.warn('Unimplemented Packet:', json.type, json);
                break;
            }
        });
    }

    addSubscription(clazz, callback) {
        this.subscribe(clazz, callback);
    }

    subscribe(clazz, callback) {
        let id                  = Crypto.randomUUID();
        let context             = clazz.getContext();
        this.Subscriptions[id]  = {
            id:         id,
            class:      clazz,
            callback:   callback
        };

        this.send({
            id:         id,
            type:       'subscribe',
            payload:    {
                variables:      JSON.parse(JSON.stringify(context.getVariables())),
                extensions:     {},
                operationName:  context.getName(),
                query:          context.toString()
            }
        });
    }

    send(data) {
        if(data instanceof Pong) {
            this.Client.emit('request', new Pong);
        } else {
            this.Client.emit('request', data);
        }

        this.Socket.send(JSON.stringify(data));
    }
}