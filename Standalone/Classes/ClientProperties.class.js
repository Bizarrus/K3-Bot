import FileSystem from 'node:fs';
import HTTPS from 'node:https';
import { parse as HTMLParser } from 'node-html-parser';

export default (new class ClientProperties {
    File        = './client.json';
    BaseURL     = 'https://app.knuddels.de/';
    Properties  = {
        build:      null,
        version:    null,
        platform:   'Web',
        type:       'K3GraphQl',
        browser:    {
            name:       'Firefox',
            version:    132,
            useragent:  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0'
        },
        urls: {
            login:          'https://www.knuddels.de/logincheck.html',
            graph:          null,
            subscription:   null,
            origin:         'https://app.knuddels.de',
            referer:        'https://app.knuddels.de',
            photo:          {
                login: {
                    page:       'https://photo.knuddels.de/photos-login.html?d=knuddels.de',
                    action:     'https://photo.knuddels.de/photos-login_submit.html'
                },
                upload: {
                    page:       'https://photo.knuddels.de/photos-settings.html?mode=uploadprofilephoto',
                    action:     'https://upload.knuddels.de'
                },
                delete: 'https://photo.knuddels.de/photos-delete.html?id='
            }
        }
    };

    constructor() {
        if(this.exists()) {
            try {
                this.Properties = Object.assign({}, this.Properties, JSON.parse(FileSystem.readFileSync(this.File, 'utf8')));
                //console.log('Loaded ClientProperties:', this.Properties);
            } catch(error) {
                console.warn('Can\'t parse', this.File, ':', error);
            }
        }
    }

    exists() {
        return FileSystem.existsSync(this.File);
    }

    resolve() {
        console.log('Trying to resolve ClientProperties from ' + this.BaseURL + '...');

        return new Promise((success, failure) => {
            this.requesting(this.BaseURL, (data) => {
                const document  = HTMLParser(data);
                const scripts   = document.getElementsByTagName('script');
                let found       = null;

                scripts.forEach((script) => {
                    let src = script.getAttribute('src');

                    if(src.match(/index\-([a-zA-Z0-9]+)\.js/g)) {
                        found = src;
                    }
                });

                if(found === null) {
                    failure('Can\'t found main-script on ' + this.BaseURL);
                    return;
                }

                this.requesting(this.BaseURL + found, (data) => {
                    let build       = null;
                    let version     = null;
                    let url_graph   = null;
                    let url_subscr  = null;

                    if(data.match(/(gitRevision):"([^"]+)",(version):"([^"]+)"/gi)) {
                        const matches   = /(gitRevision):"([^"]+)",(version):"([^"]+)"/gi.exec(data);
                        build           = matches[2];
                        version         = matches[4];
                    } else {
                        failure('Can\'t found Revision or Version on main-script');
                        return;
                    }

                    if(data.match(/(graphQl):"([^"]+)"/gi)) {
                        const matches   = /(graphQl):"([^"]+)"/gi.exec(data);
                        url_graph       = matches[2];
                    } else {
                        failure('Can\'t found graphQl on main-script');
                        return;
                    }

                    if(data.match(/(graphQlSubscription):"([^"]+)"/gi)) {
                        const matches   = /(graphQlSubscription):"([^"]+)"/gi.exec(data);
                        url_subscr      = matches[2];
                    } else {
                        failure('Can\'t found graphQlSubscription on main-script');
                        return;
                    }

                    if(build !== null) {
                        this.Properties.build = build;
                    }

                    if(version !== null) {
                        this.Properties.version = version;
                    }

                    if(url_graph !== null) {
                        this.Properties.urls.graph = url_graph;
                    }

                    if(url_subscr !== null) {
                        this.Properties.urls.subscription = url_subscr;
                    }

                    //console.log('Updated ClientProperties:', this.Properties);
                    
                    FileSystem.writeFile(this.File, JSON.stringify(this.Properties, null, 4), (error) => {
                        if(error) {
                            console.error('Can\'t save', this.File, ':', error);
                            return;
                        }

                        console.warn(this.File, 'was saved on root-directory!');
                    });
                    
                    success();
                });
            });
        });
    }

    requesting(file, callback) {
        HTTPS.get(file, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                callback(data);
            });
        }).on('error', (error) => {
            console.log('HTTP-Error:', error.message);
        })
    }

    get(key) {
        if(key.indexOf('.') !== -1) {
            return key.split('.').reduce((current, key) => current && current[key], this.Properties);
        }
        
        if(typeof(this.Properties[key]) !== 'undefined') {
            return this.Properties[key];
        }

        return null;
    }
}());