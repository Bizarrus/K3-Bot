import OS from 'node:os';

export default class OSInfo {
    Type            = null;
    Version         = null;
    Architecture    = null;

    constructor() {
        switch(OS.machine()) {
            case 'arm64':
            case 'aarch64':
            case 'mips64':
            case 'ppc64':
            case 'ppc64le':
            case 'i686':
            case 'x86_64':
                this.Architecture = 64;
            break;
            case 'arm':
            case 'mips':
            case 'mips':
            case 'i386':
                this.Architecture = 32;
            break;
        }

        switch(OS.type()) {
            case 'Linux':
                this.Type = 'Linux';
            break;
            case 'Darwin':
                this.Type = 'macOS';
            break;
            case 'Windows_NT':
                this.Type = 'Windows';
            break;
        }

        this.Version    = OS.version() + ' ' + (this.Architecture === null ? 'unknown' : this.Architecture + '-bit');
    }

    getType() {
        return this.Type;
    }

    getVersion() {
        return this.Version;
    }

    getArchitecture() {
        return this.Architecture;
    }

    toJSON() {
        return {
            type:       this.Type,
            version:    this.Version
        }
    }
}