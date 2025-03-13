import GraphBuilder from '../Network/GraphBuilder.class.js';
import { Type } from '../Network/GraphQL.class.js';
import ISubscription from '../ISubscription.interface.js';

export default class HappyMomentEvents extends ISubscription {
    constructor() {
        super();

        this.Context    = new GraphBuilder(Type.Subscription, 'happyMomentEvents');
        this.Context.addFragment('LongConversationOccurred');
        this.Context.addFragment('DailyLoginUsed');
        this.Context.addFragment('FriendRequestAccepted');
    }

    getContext() {
        return this.Context;
    }

    parse(data) {
        console.log('[HappyMomentEvents]', data);
        return data;
    }
}