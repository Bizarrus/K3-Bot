import GraphBuilder from '../Network/GraphBuilder.class.js';
import { Type } from '../Network/GraphQL.class.js';
import ISubscription from '../ISubscription.interface.js';

export default class AppEvents extends ISubscription {
    constructor() {
        super();

        this.Context    = new GraphBuilder(Type.Subscription, 'AppEvents');
    }

    getContext() {
        return this.Context;
    }

    parse(data) {
        return data.payload.data.appEvent;
    }
}