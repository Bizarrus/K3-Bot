import FileSystem from 'node:fs';
import Path from 'node:path';
import Crypto from 'node:crypto';
import AuthSession from './Models/AuthSession.class.js';

export default (new class SessionStorage {
    Path = './storage';

    constructor() {
        if(!FileSystem.existsSync(this.Path)) {
            FileSystem.mkdirSync(this.Path);
        }
    }

    exists(username) {
        const hmac = Crypto.createHmac('sha256', 'session');
        hmac.update(username);
        let file = Path.join(this.Path, hmac.digest('hex') + '.json');

        if(FileSystem.existsSync(file)) {
            return true;
        }

        return false;
    }

    get(username) {
        const hmac = Crypto.createHmac('sha256', 'session');
        hmac.update(username);
        let file = Path.join(this.Path, hmac.digest('hex') + '.json');

        if(FileSystem.existsSync(file)) {
            try {
                let json    = JSON.parse(FileSystem.readFileSync(file, 'utf8'));
                let session = new AuthSession({
                    expiry: json.Expiring,
                    token:  json.Token
                });
                return session;
            } catch(error) {
                console.error('Can\'t parse', file, ':', error);
            }
        } else {
            console.error('Can\'t load', file);
        }

        return null;
    }

    update(username, session) {
        const hmac = Crypto.createHmac('sha256', 'session');
        hmac.update(username);
        let file = Path.join(this.Path, hmac.digest('hex') + '.json');

        FileSystem.writeFile(file, JSON.stringify(session.toJSON(), null, 4), (error) => {
            if(error) {
                console.error('Can\'t save', file, ':', error);
                return;
            }

            console.warn(file, 'was saved!');
        });

    }
}());