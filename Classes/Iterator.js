
class Iterator {
    constructor(list) {
        this.list = list;
        this.position = 0;
    }

    skip() {
        ++this.position;
    }

    next() {
        let result = this.current();
        this.skip();
        return result;
    }

    current() {
        return this.list[this.index()];
    }

    isEmpty() {
        return (this.current().trim().length === 0);
    }

    index() {
        return this.position;
    }

    isEnd() {
        return (this.position < this.list.length);
    }

    run(callback) {
        return new Promise((success, error) => {
            try {
                for(; this.isEnd(); this.skip()) {
                    callback(this);
                }

                success();
            } catch(e) {
                error(e);
            }
        });
    }
}