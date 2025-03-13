import JPEG from 'jpeg-js';
import HTTPS from 'node:https';
import Logger from '../Logger.class.js';
import FileSystem from 'node:fs';
import URL from 'node:url';
import { Buffer } from 'node:buffer';
import { parse as HTMLParser } from 'node-html-parser';
import Config from '../Config.class.js';
import ClientProperties from '../ClientProperties.class.js';

/**
 Example 1:
    Photo.uploadProfilePicture('https://images.wallpapersden.com/image/download/simple-night_a2htbGyUmZqaraWkpJRoZWWtaGVl.jpg', (error) => {
        if(error) {
            console.error('Error:', error);
            return;
        }

        console.info('Upload OK');
    });

 Example 2:
    Photo.createEmptyPicture(300, 300).then((image) => {
        Photo.uploadProfilePicture(image, (error) => {
            if(error) {
                console.error('Error:', error);
                return;
            }

            console.info('Upload OK');
        });
    });
 */
export const Photo = (new class Photo {
    Cookies = null;

    login() {
        return new Promise((success, failure) => {
            let user = Config.getUser(0);

            this.requesting(ClientProperties.get('urls.photo.login.page'), (data) => {
                const document  = HTMLParser(data);
                const form      = document.getElementsByTagName('form')[0];
                const button    = form.querySelector('.bbutton.submit');
                const submit    = button.id.replace('submit-button-', '');

                this.submit(ClientProperties.get('urls.photo.login.action'), {
                    nickname:       user.nickname,
                    password:       user.password,
                    submitElement:  submit
                }, (error, message, cookies) => {
                    if(error === null) {
                        this.Cookies = cookies;
                        success(cookies);
                        return;
                    }

                    failure(error, message);
                });
            });
        });
    }

    delete() {
        let user = Config.getUser(0);
        Logger.warn('Using deprecated Photo-API.');

        this.login().then((cookies) => {
            this.getLocation(ClientProperties.get('urls.photo.delete') + this.escapeNickname(user.nickname) + '-pro0l0p', (error, url) => {
                if(error === null) {
                    return;
                }
            });
        });
    }

    escapeNickname(nickname) {
        nickname    = nickname.toLowerCase();
        let results = [];
        
        for(let position = 0; position < nickname.length; position++) {
		    const character = nickname.charCodeAt(position);

            /* A-Z & 0-9 */
            if((character >= 97 && character <= 122) || (character >= 65 && character <= 90) || (character >= 48 && character <= 57)) {
                results.push(String.fromCharCode(character));
            
            /* Space */
            } else if(character === 32) {
                results.push('_-');

            /* Unicode under 256: Controls, Printable, Umlauts */
            } else if(character < 256) {
                results.push('_' + String.fromCharCode(((character >>> 4) & 15) + 97) + String.fromCharCode((character & 15) + 97));
            
            /* All Others: Emojis & Additional higher Characters */
            } else {
                results.push('__' + String.fromCharCode(((character >>> 12) & 15) + 97) + String.fromCharCode(((character >>> 8) & 15) + 97) + String.fromCharCode(((character >>> 4) & 15) + 97) + String.fromCharCode((character & 15) + 97));
            }
        }

        return results.join('');
    }

    uploadProfilePicture(file, callback) {
        if(file.startsWith('http://') || file.startsWith('https://')) {
            this.requesting(file, (filedata) => {
                this.startUploadProfilePicture(filedata.toString('hex'), callback);
            });
        } else {
            this.startUploadProfilePicture(Buffer.from(file, 'base64').toString('hex'), callback);
        }
    }
    
    startUploadProfilePicture(hex, callback) {
        Logger.warn('Using deprecated Photo-API.');
        
        this.login().then((cookies) => {
            this.getLocation(ClientProperties.get('urls.photo.upload.page'), (error, url) => {
                if(error === null) {
                    this.requesting(url, (data) => {
                        let document    = HTMLParser(data);
                        let form        = document.querySelector('form');
                        let action      = ClientProperties.get('urls.photo.upload.action') + '/' + form.getAttribute('action');
                        const boundary  = '----WebKitFormBoundary' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
                        const parts     = [];

                        parts.push(Buffer.from('--' + boundary + '\r\nContent-Disposition: form-data; name="file0"; filename="randomImage' + Date.now().toString(16) + '.jpg"\r\nContent-Type: image/jpeg\r\n\r\n'));
                        parts.push(Buffer.from(hex, 'hex'));
                        parts.push(Buffer.from('\r\n'));

                        for(const [key, value] of Object.entries({
                            submitElement: 'nojava'
                        })) {
                            parts.push(Buffer.from('--' + boundary + '\r\nContent-Disposition: form-data; name="' + key + '"\r\n\r\n' + value));
                            parts.push(Buffer.from('\r\n'));
                        }

                        parts.push(Buffer.from('--' + boundary + '--'));
                        const body = Buffer.concat(parts);
                        const req   = HTTPS.request(action, {
                            method:     'POST',
                            headers: {
                                'Content-Type':     'multipart/form-data;boundary=' + boundary,
                                'Content-Length':   Buffer.byteLength(body),
                                'Origin':           ClientProperties.get('urls.photo.upload.action'),
                                'Referer':          action,
                                'User-Agent':       ClientProperties.get('browser.useragent'),
                                'Cookie':           this.Cookies
                            }
                        }, (res) => {
                            //console.log('Response:', res.headers['location']);

                            // 302 = Upload OK
                            if(res.statusCode === 302) {
                                callback(null);
                                return;
                            }

                            callback('Unknown Error.');
                        });
                    
                        req.on('error', (error) => console.error('Error:', error));
                        req.write(body);
                        req.end();
                    });
                    return;
                }

                console.error('[Photo] Can\'t fetch upload URL:', error);
            });
        }).catch((error, message) => {
            console.error('[Photo] Can\'t login on ' + error + ': ' + message);
        });
    }

    createEmptyPicture(width, height) {
        return new Promise((success, failure) => {
            try {
                const buffer = Buffer.alloc(width * height * 4, 0);

                for(let pixel = 0; pixel < buffer.length; pixel += 4) {
                    buffer[pixel + 3] = 255;
                }
    
                success(JPEG.encode({ data: buffer, width, height }, 100).data.toString('base64'));
            } catch(error) {
                failure(error);
            }
        });
    }

    submit(file, data, callback) {
        let body    = new URLSearchParams(data).toString();
        let request = HTTPS.request(file, {
            method:     'POST',
            headers:    {
                'Content-Type':     'application/x-www-form-urlencoded',
                'Content-Length':   body.length,
                'Accept':           'text/html',
                'Origin':           ClientProperties.get('urls.origin'),
                'Referer':          ClientProperties.get('urls.referer'),
                'User-Agent':       ClientProperties.get('browser.useragent'),
                'Cookie':           'knJwt=null;de__knJwt=null;de__lastUsedDeviceToken=null;',
            },
        }, (response) => {
            if(response.statusCode === 302) {
                callback(null, null, response.headers['set-cookie']);
            } else {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });
                
                response.on('end', () => {
                    HTMLParser(data).querySelectorAll('.formerror').forEach((error) => {
                        if(error.id === 'err-photologin-nickname' && error.rawText.trim().length >= 1) {
                            callback('nickname', error.rawText.trim(), response.headers['set-cookie']);
                        } else  if(error.id === 'err-photologin-password' && error.rawText.trim().length >= 1) {
                            callback('password', error.rawText.trim(), response.headers['set-cookie']);
                        }
                    });
                });
            }
        });
        
        request.on('error', (error) => {
            callback('HTTP', error.message);
        });

        request.write(body);
        request.end();
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
        });
    }

    getLocation(file, callback) {
        let request = HTTPS.request(file, {
            method:     'GET',
            headers:    {
                'Accept':           'text/html',
                'Origin':           ClientProperties.get('urls.origin'),
                'Referer':          ClientProperties.get('urls.photo.upload.page'),
                'User-Agent':       ClientProperties.get('browser.useragent'),
                'Cookie':           this.Cookies
            },
        }, (response) => {
            callback(null, response.headers['location']);
        });
        
        request.on('error', (error) => {
            callback(error);
        });

        request.end();
    }
}());

export default Photo;