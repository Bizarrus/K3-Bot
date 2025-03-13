import GraphBuilder from '../Network/GraphBuilder.class.js';
import { Type } from '../Network/GraphQL.class.js';
import ISubscription from '../ISubscription.interface.js';

export default class AdFreeAcquired extends ISubscription {
    constructor() {
        super();

        this.Context    = new GraphBuilder(Type.Subscription, 'AdFreeAcquired');
        this.Context.addFragment('UserWithAdFree');
    }

    getContext() {
        return this.Context;
    }

    parse(data) {
        return data;
    }
}