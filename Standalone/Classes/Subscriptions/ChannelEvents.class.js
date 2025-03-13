import GraphBuilder from '../Network/GraphBuilder.class.js';
import { Type } from '../Network/GraphQL.class.js';
import ISubscription from '../ISubscription.interface.js';

export default class ChannelEvents extends ISubscription {
    constructor() {
        super();

        this.Context    = new GraphBuilder(Type.Subscription, 'ChannelEvents');
        this.Context.addFragment('ChannelMessage');
        this.Context.addFragment('ChannelUser');
        this.Context.addFragment('NicklistIcon');
        this.Context.addFragment('ProfilePictureUser');
        this.Context.addFragment('ProfilePictureOverlays');
        this.Context.addFragment('ChannelMsgUser');
        this.Context.setVariable('pixelDensity', 1);
    }

    getContext() {
        return this.Context;
    }

    parse(data) {
        return data.payload.data.channelEvent;
    }
}