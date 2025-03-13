const browser = browser || {
    browserAction: chrome.action,
    pageAction: chrome.action,
};

class Injector {
    Version = '1.0.0';
    Backend;
    CurrentChannel;
    Bridge;

    import(file) {
        return new Promise((success, error) => {
            const src = chrome.runtime.getURL(file);
            const script = document.createElement('script');
            script.setAttribute("type", "module");
            script.setAttribute("src", src);
            script.onload = success;
            const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
            head.insertBefore(script, head.lastChild);
        });
    }

    constructor() {
        this.import('Classes/Logger.js').then(() => {
            console.log("Imported", Logger);
            this.init();
        });
    }

    init() {
        Logger.info('Initialize Injector-Script', 'v' + this.Version);

        this.Backend = browser.runtime.connect({ name: "K3-Bot"});
        this.CurrentChannel = null;
        this.Bridge  = new Bridge();
        this.trackChanges();

        this.Backend.onMessage.addListener((packet) => {
            switch(packet.name) {
                case 'socket':
                    this.Bridge.onReceive(packet.data);
                break;
                case 'channel':
                    Logger.warn("CHAN SYNC");
                break;
                case 'send':
                    this.sendToChat(packet.data.token, packet.data.data).then((response) => {
                        this.send(packet.id, response);
                    });
                break;
                case 'FotoMeet':
                    /* Do Nothing */
                break;
                default:
                    Logger.warn('Unhandled Packet:', packet.name, packet.data);
                break;
            }
        });

        this.send('init');
    }

    sendToChat(token, json) {
        return new Promise((success, error) => {
            let request = new XMLHttpRequest();
            request.open('POST', 'https://api-de.knuddels.de/api-gateway/graphql', true);
            request.setRequestHeader('Authorization', 'Bearer ' + token);
            request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            request.setRequestHeader('Referer', 'https://app.knuddels.de/');

            request.onreadystatechange = function() {
                if(this.readyState === XMLHttpRequest.DONE) {
                    //Logger.info('[REQUEST]', json);

                    let response = JSON.parse(this.responseText);

                    if(response.data) {
                        //Logger.info('[RESPONSE]', response.data);
                        success(response.data);
                    }

                    if(response.errors && response.errors.length > 0) {
                        response.errors.forEach((error) => {
                            //Logger.error((error.type ? error.type + ': ' : '') + error.message);
                        });

                        error(response.errors);
                    }
                }
            };

            request.send(JSON.stringify(json));
        });
    }

    send(name, data) {
        Logger.debug('Backend', '>>', {
            name: name,
            data: data
        });

        this.Backend.postMessage({
            name: name,
            data: data
        });
    }

    trackChanges() {
        const observable = () => document.location.pathname;

        let oldValue = observable();
        new MutationObserver(() => {
            const newValue = observable();

            if(oldValue !== newValue) {
                this.handleChanges(newValue, oldValue);
                oldValue = newValue;
            }
        }).observe(document.body, {
            childList: true,
            subtree: true
        });

        this.handleChanges(oldValue, null);
    }

    handleChange(data, callback) {
        if(data === null) {
            return;
        }

        let list = [];

        new Iterator(data.split('/')).run((context) => {
            if(context.isEmpty()) {
                context.skip();
                return;
            }

            let current = context.current();

            switch(current) {
                case 'channel':
                    context.skip();
                    break;
                case 'channelList':
                    context.skip();
                    list.push({
                        type: 'ChannelList',
                        name: context.next()
                    });
                    break;
                case 'messenger':
                    context.skip();
                    list.push({
                        type: 'Messenger',
                        name: context.next()
                    });
                    break;
                case 'profile':
                    context.skip();
                    list.push({
                        type: 'Profile',
                        name: context.next()
                    });
                    break;
                case 'contacts':
                    context.skip();
                    list.push({
                        type: 'Contacts',
                        name: context.next()
                    });
                    break;
                case 'globalApps':
                    context.skip();
                    list.push({
                        type: 'GlobalApp',
                        name: context.next()
                    });
                    break;
                case 'smileyTrade':
                    context.skip();
                    list.push({
                        type: 'SmileyTrade',
                        name: context.next()
                    });
                    break;
                case 'settings':
                    context.skip();
                    list.push({
                        type: 'Settings',
                        name: context.next()
                    });
                    break;
                default:
                    /* Is Channel-ID */
                    if(current.match(/([\d]+):([\d]+)/)) {
                        this.CurrentChannel = current;
                        this.send('channel', this.CurrentChannel);
                        list.push({
                            type: 'Channel',
                            name: current
                        });
                        return;
                    }

                    /* Is external App */
                    if(current.match(/^app\-/)) {
                        context.skip();
                        list.push({
                            type: 'App',
                            name: current.replace('app-', ''),
                            view: context.next()
                        });
                        return;
                    }

                    Logger.warn('Unhandled:', current);
                    break;
            }
        }).then(() => {
            callback(list);
        });
    }

    handleChanges(newValue, oldValue) {
        this.handleChange(newValue, (view) => {
            this.handleChange(oldValue, (changed) => {
                this.Bridge.onViewChange(view, changed);
            });
        });
    }
}

window.Injector = new Injector();