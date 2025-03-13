import Crypto from 'node:crypto';

export default class DeviceIdentifier {
    UUID = null;

    constructor() {
        this.UUID = Crypto.randomUUID();
    }

    get() {
        return this.UUID;
    }

    toJSON() {
        return [
            this.UUID
        ];
    }
}