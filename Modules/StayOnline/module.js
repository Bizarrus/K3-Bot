export default class StayOnline {
    constructor() {
        this.Task       = null;
        this.Interval   = 60 * 3;
    }

    onInit() {
        console.log('StayOnline init!');

        this.Task = setInterval(() => {
            this.sendCommand('/dice 1W100!');
        }, this.Interval * 1000);
    }
}