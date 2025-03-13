export default class KeepOnlineV2 {
    Success = false;

    constructor(state) {
        this.Success = state;
    }

    get() {
        return this.Success;
    }
}