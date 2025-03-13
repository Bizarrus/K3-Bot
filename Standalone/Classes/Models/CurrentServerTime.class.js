export default class CurrentServerTime {
    Time = null;

    constructor(time) {
        this.Time = parseInt(time);
    }

    get() {
        return this.Time;
    }
}