import * as Events from 'node:events';

export default class IPlugin extends Events.EventEmitter {
    constructor() {
        super();
    }
}