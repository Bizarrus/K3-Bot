import ClientProperties from '../ClientProperties.class.js';

export default class DeviceInfo {
    Manufacturer    = null;
    version         = null;

    constructor() {
        this.Manufacturer   = ClientProperties.get('browser.name');
        this.Version        = '' + ClientProperties.get('browser.version');
    }

    getManufacturer() {
        return this.Manufacturer;
    }
    
    getVersion() {
        return this.Version;
    }

    toJSON() {
        return {
            manufacturer:   this.Manufacturer,
            model:          this.Version
        };
    }
}
