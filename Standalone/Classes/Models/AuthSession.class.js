import * as Events from 'node:events';

export default class AuthSession extends Events.EventEmitter {
    Expiring    = 0;
    Connection  = null;
    Login       = null;
    _Watcher    = null;

    constructor(json) {
        super();

        this.Expiring       = parseInt(json.expiry);

        if(typeof(json.connection) !== 'undefined') {
            this.Connection     = json.connection;
        }

        if(typeof(json.login) !== 'undefined') {
            this.Login          = json.login;
        }

        this._Watcher       = setInterval(this.check.bind(this), 1000);
    }

    getConnectionToken() {
        return this.Connection;
    }

    getLoginToken() {
        return this.Login;
    }

    isExpired() {
        return this.Expiring == 0 || (Date.now() + (5 * 60 * 1000) >= this.Expiring);
    }

    update(json) {
        this.Expiring       = parseInt(json.expiry);
       
        if(typeof(json.connection) !== 'undefined') {
            this.Connection     = json.connection;
        }

        if(typeof(json.login) !== 'undefined') {
            this.Login          = json.login;
        }

        if(this._Watcher) {
            clearInterval(this._Watcher);
        }

        this._Watcher   = setInterval(this.check.bind(this), 1000);
    }

    check() {
        if(this.isExpired()) {
            this.emit('expired', true);
        }
    }

    toJSON() {
        return {
            Expiring:   this.Expiring,
            Login:      this.Login,
            Connection: this.Connection
        };
    }
}