import OSInfo from './OSInfo.class.js';
import DeviceInfo from './DeviceInfo.class.js';
import DeviceIdentifier from './DeviceIdentifier.class.js';
import ClientVersion from './ClientVersion.class.js';
import ClientProperties from '../ClientProperties.class.js';

export default class SessionInfo {
    ClientState         = 'Active';
    ClientVersion       = new ClientVersion();
    DeviceIdentifier    = new DeviceIdentifier();
    DeviceInfo          = new DeviceInfo();
    OSInfo              = new OSInfo();
    Platform            = null;
    Type                = null;

    constructor() {
        this.Platform   = ClientProperties.get('platform');
        this.Type       = ClientProperties.get('type');
    }

    toJSON() {
        return {
            clientState:        this.ClientState,
            clientVersion:      this.ClientVersion.toJSON(),
            deviceIdentifiers:  this.DeviceIdentifier.toJSON(),
            deviceInfo:         this.DeviceInfo.toJSON(),
            osInfo:             this.OSInfo.toJSON(),
            platform:           this.Platform,
            type:               this.Type
        }
    }
}