import GraphBuilder from '../Network/GraphBuilder.class.js';
import { Type } from '../Network/GraphQL.class.js';
import ISubscription from '../ISubscription.interface.js';

export default class Notification extends ISubscription {
    constructor() {
        super();

        this.Context    = new GraphBuilder(Type.Subscription, 'Notifications');
        this.Context.addFragment('Notification');
        this.Context.addFragment('Color');
        this.Context.setVariable('pixelDensity', 1);
    }

    getContext() {
        return this.Context;
    }

    parse(data) {
        return data.payload.data.notificationReceived;
    }
}