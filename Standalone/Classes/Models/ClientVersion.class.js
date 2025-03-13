import ClientProperties from '../ClientProperties.class.js';

export default class ClientVersion {
    BuildInfo   = null;
    Major       = -1;
    Minor       = -1;
    Patch       = -1;

    constructor() {
        this.BuildInfo  = ClientProperties.get('build');
        let parts       = ClientProperties.get('version').split('.');
        this.Major      = parts[0];
        this.Minor      = parts[1];
        this.Patch      = parts[2];
    }

    getVersion() {
        return [
            this.Major,
            this.Minor,
            this.Patch
        ].join('.');
    }

    toJSON() {
        return {
            buildInfo:      this.BuildInfo,
            major:          this.Major,
            minor:          this.Minor,
            patch:          this.Patch
        };
    }
}