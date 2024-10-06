/*
* Dies ist das Backend-Script.
* Dies blockt Web-Requests und kümmert sich um das Module-Handling.
**/
import Knuddels from './Knuddels.js';

/* Modules */
/* Können leider nicht dynamisch geladen werden, oder? */
import FotoMeet from '../Modules/FotoMeet/module.js';
import StayOnline from '../Modules/StayOnline/module.js';
import HalloweenHunt from '../Modules/HalloweenHunt/module.js';

class Backend {
    Port;
    Requests;
    Queue;
    Promises;
    Modules;
    SendID;

    constructor() {
        this.SendID = 0;
        this.Port = null;
        this.Queue = [];
        this.Requests = [];
        this.Modules = [];
        this.Promises = [];

        this.loadModules();
        browser.runtime.onConnect.addListener(this.onConnect.bind(this));
        this.modifyKnuddelsRequests();
        this.trackRequests();

        setInterval(() => {
            let entry = this.Queue.shift();

            if(entry) {
                this.send(entry.name, entry.data);
            }
        }, 500);
    }

    loadModules() {
        [
            'FotoMeet',
            'StayOnline',
            'HalloweenHunt'
        ].forEach((name) => {
            let module = null;

            switch(name) {
                case 'FotoMeet':
                    module = new FotoMeet();
                    break;
                case 'StayOnline':
                    module = new StayOnline();
                    break;
                case 'HalloweenHunt':
                    module = new HalloweenHunt();
                    break;
            }

            module.send = (name, data) => {
                this.send(name, data);
            };

            module.sendPrivateMessage = (nickname, message) => {
                Knuddels.sendPrivateMessage(this, nickname, message);
            };

            module.sendPublicMessage = (message) => {
                Knuddels.sendPublicMessage(this, message);
            };

            module.sendCommand = (command) => {
                return Knuddels.sendCommand(this, command);
            };

            module.getUser = (user_id) => {
                return Knuddels.getUser(this, user_id);
            };

            if(typeof(module.onInit) !== 'undefined') {
                module.onInit();
            }

            this.Modules.push(module);
        });
    }

    onConnect(port) {
        this.Port = port;
        this.Port.onMessage.addListener((m) => {
            this.onData(m);
        });

        this.send('channel', Knuddels.getCurrentChannel());
    }

    send(name, data) {
        return new Promise((success, error) => {
            try {
                if(this.Port === null) {
                    this.Queue.push({
                        name: name,
                        data: data
                    });
                    return;
                }

                let id     = ++this.SendID;
                this.Promises[id]  = success;

                this.Port.postMessage({
                    id: id,
                    name: name,
                    data: data
                });
            } catch(e) {
                error(e);
            }
        });
    }

    modifyKnuddelsRequests() {
        browser.webRequest.onBeforeSendHeaders.addListener((data) => {
            let blocking = false;

            if(data.url.match(/(pics\/promotion|vip_banner)/)) {
                blocking = true;
            }

            /*if(data.url.match(/knuddels\-api\-core\.js/)) {
                //"data:text/javascript;charset=UTF-8;base64," + btoa("console.log('FUNZT!')")
                let file = browser.runtime.getURL('UI/AppLoader/API.js');

                return {
                    redirectUrl: file
                };
            }*/

            return {
                cancel: blocking
            };
        }, {
            urls: [
                '<all_urls>'
            ],
        }, [
            'blocking'
        ]);
    }

    trackRequests() {
        browser.webRequest.onBeforeSendHeaders.addListener((data) => {
            let blocking = false;

            if(typeof(this.Requests[data.requestId]) !==  'undefined') {
                this.Requests[data.requestId].Header.Request = data.requestHeaders;

                data.requestHeaders.forEach((header) => {
                    if(header.name.toLowerCase() === 'Authorization'.toLowerCase()) {
                        Knuddels.setToken(header.value.replace('Bearer ', ''));
                    }
                })
            }

            return {
                cancel: blocking
            };
        }, {
            urls: [
                '<all_urls>'
            ],
            types: ['websocket', 'xmlhttprequest']
        }, [
            'blocking',
            'requestHeaders'
        ]);

        browser.webRequest.onBeforeRequest.addListener((data) => {
            let blocking = false;
            let response = new Uint8Array(0);
            let filter = browser.webRequest.filterResponseData(data.requestId);

            filter.ondata = (event) => {
                filter.write(event.data);
                var tmp = new Uint8Array(response.byteLength + event.data.byteLength);
                tmp.set(new Uint8Array(response), 0);
                tmp.set(new Uint8Array(event.data), response.byteLength);
                response = tmp.buffer;
            };

            filter.onstop = (event) => {
                filter.disconnect();

                if(typeof(this.Requests[data.requestId]) !== 'undefined') {
                    let request = this.Requests[data.requestId];
                    request.URL = data.url;
                    request.Body.Response = new TextDecoder().decode(response);
                    request.Bytes.Receive = response.byteLength;

                    this.Modules.forEach((module) => {
                        if(typeof(module.onReceive) !== 'undefined') {
                            module.onReceive(request);
                        }
                    });

                    this.send('socket', request);
                }
            };

            /* GraphQL */
            if(data.url === 'https://api-de.knuddels.de/api-gateway/graphql') {
                let body = null;
                let form = null;
                let send = 0;

                if(data.requestBody && data.requestBody.raw && data.requestBody.raw[0]) {
                    let bytes = data.requestBody.raw[0].bytes;
                    body = decodeURIComponent(String.fromCharCode.apply(null,new Uint8Array(bytes)));
                    send += bytes.byteLength;

                    if(data.requestBody.formData) {
                        form = JSON.stringify(data.requestBody.formData);
                        send += form.length;
                    }
                }

                this.Requests[data.requestId] = {
                    Type: 'GraphQL',
                    Method: data.method,
                    Time: data.timeStamp,
                    Body: {
                        Response: response,
                        Request: body,
                        Data: form
                    },
                    Bytes: {
                      Send: send,
                      Receive: response.byteLength
                    },
                    Header: {
                        Request: data.requestHeaders,
                        Response: null
                    }
                };
            /* WebSocket */
            } else if(data.url === "wss://api-de.knuddels.de/api-gateway/subscriptions") {
                let body = null;
                let form = null;
                let send = 0;

                if(data.requestBody && data.requestBody.raw && data.requestBody.raw[0]) {
                    let bytes = data.requestBody.raw[0].bytes;
                    body = decodeURIComponent(String.fromCharCode.apply(null,new Uint8Array(bytes)));
                    send += bytes.byteLength;

                    if(data.requestBody.formData) {
                        form = JSON.stringify(data.requestBody.formData);
                        send += form.length;
                    }
                }

                this.Requests[data.requestId] = {
                    Type: 'WebSocket',
                    Time: data.timeStamp,
                    Body: {
                        Response: response,
                        Request: body,
                        Data: form
                    },
                    Bytes: {
                        Send: send,
                        Receive: response.byteLength
                    },
                    Header: {
                        Request: null,
                        Response: null
                    }
                };

            /* Block external Services*/
            } else if(data.url.match(/(sonar\.script\.ac|ay\.delivery|netpoint\-media\.de|dnacdn\.net|fundingchoicesmessages\.google\.com|clean\.gg|doubleclick\.|analytics\.google|adnz\.co|adnxs\.com|a\-mx\.com|criteo\.com|teads\.tv|amazon\-adsystem\.com|4dex\.io|googlesyndication\.com)/)) {
                blocking = true;

            /* Not handled */
            } else {
                console.warn(data.url, data);
            }

            return {
                cancel: blocking
            };
        }, {
            urls: [
                '<all_urls>'
            ],
            types: ['websocket', 'xmlhttprequest']
        }, [
            'blocking',
            'requestBody'
        ]);

        browser.webRequest.onCompleted.addListener((data) => {
            if(typeof(this.Requests[data.requestId]) !==  'undefined') {
                this.Requests[data.requestId].Header.Response = data.responseHeaders;
                this.Requests[data.requestId].Debug = data;
            }
        }, {
            urls: [
                '<all_urls>'
            ],
            types: ['websocket', 'xmlhttprequest']
        }, [
            'responseHeaders'
        ]);
    }

    onMenuClick(name) {
        switch(name) {
            case 'konsole':
                console.log(browser.devtools);
                console.log(browser.devtools_panels);

                browser.notifications.create('onInstalled', {
                    type: 'basic',
                    iconUrl: browser.runtime.getURL("Assets/Icons/Logo.png"),
                    title: 'StayOnline',
                    message: `Wurde gestartet.`,
                });
            break;
            case 'mods':
                browser.windows.create({
                    type: "popup",
                    url: browser.extension.getURL("UI/Popups/Mods.html"),
                    titlePreface: 'Mods',
                    width: 250,
                    height: 100,
                    focused: true
                }).then((info) => {
                    console.log("WINDOW:", info);
                });
            break;
        }
    }

    onData(packet) {
        switch(packet.name) {
            case 'init':
                /* Adding Browser-Icon to Address-Bar */
                browser.pageAction.show(this.Port.sender.tab.id);
            break;
            case 'channel':
                Knuddels.setCurrentChannel(packet.data);
            break;
            case 'menu':
                this.onMenuClick(packet.data);
            break;
            default:
                if(typeof(packet.name) === 'number' && typeof(this.Promises[packet.name]) !== 'undefined') {
                    this.Promises[packet.name](packet.data);
                    delete this.Promises[packet.name];
                    return;
                }

                console.warn('Unhandled Packet:', packet.name, packet.data);
            break;
        }
    }
}

new Backend();

