import GraphBuilder from '../Network/GraphBuilder.class.js';
import { Type } from '../Network/GraphQL.class.js';
import ISubscription from '../ISubscription.interface.js';

export default class ClientSettings extends ISubscription {
    constructor() {
        super();

        this.Context    = new GraphBuilder(Type.Subscription, 'ClientSettingsSubscription');
        this.Context.addFragment('ClientSettingsChanged');
        this.Context.addFragment('AllClientSettings');
        this.Context.addFragment('MacroBoxSettingsEntry');
    }

    getContext() {
        return this.Context;
    }

    parse(data) {
        return data.payload.data.clientSettingsEvent;
    }
}