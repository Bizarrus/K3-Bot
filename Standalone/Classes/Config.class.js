import FileSystem from 'node:fs';

export default (new class Config {
    File        = './config.json';
    Update      = false;
    Config      = {
        nicknames: [],
        storage: {
            sessions: true
        },
        connection: {
            heartbeat: 60000
        }
    };

    constructor() {
        if(this.exists()) {
            try {
                this.Config = Object.assign({}, this.Config, JSON.parse(FileSystem.readFileSync(this.File, 'utf8')));
                // console.log('Loaded Config:', this.Config);
            } catch(error) {
                console.warn('Can\'t parse', this.File, ':', error);
            }
        }
        
        if(this.Update) {
            FileSystem.writeFile(this.File, JSON.stringify(this.Config, null, 4), (error) => {
                if(error) {
                    console.error('Can\'t update', this.File, ':', error);
                    return;
                }

                console.warn(this.File, 'was updated on root-directory!');
            });
        }
    }

    exists() {
        return FileSystem.existsSync(this.File);
    }

    get(key, defaults) {
        let value = null;

        if(typeof(defaults) === 'undefined') {
            defaults = null;
        }

        if(key.indexOf('.') !== -1) {
            value = key.split('.').reduce((current, part) => current && current[part], this.Config);
            
            if(typeof(value) === 'undefined') {
                value = null;
            }
        }
        
        if(typeof(this.Config[key]) !== 'undefined') {
            value = this.Config[key];
        }

        if(value !== null) {
            return value;
        }

        return defaults;
    }

    getUser(id) {
        if(typeof(this.Config.nicknames[id]) === 'undefined') {
            return null;
        }

        return this.Config.nicknames[id];
    }
}());