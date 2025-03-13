export default class ISubscription {    
    Context     = null;

    constructor() {
        if(!this.getContext) {
            throw new Error('Unimplemented Method: void getContext()');
        }

        if(!this.parse) {
            throw new Error('Unimplemented Method: JSON parse(JSON data)');
        }
    }
}