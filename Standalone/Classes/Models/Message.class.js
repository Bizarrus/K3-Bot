import Crypto from 'node:crypto';
import { GraphQL, Type } from '../Network/GraphQL.class.js';
import GraphBuilder from '../Network/GraphBuilder.class.js';
import Text from '../Utils/Text.class.js';
import User from './User.class.js';

export default class Message {
    Client          = null;
    ID              = null;
    Conversation    = null;
    Visibility      = null;
    Text            = null;
    Time            = null;

    constructor(client, data) {
        this.Client         = client;
        this.Conversation   = data.id;
        this.Visibility     = data.visibility;
        this.ID             = data.latestConversationMessage.id;

        if(typeof(data.latestConversationMessage.content) !== 'undefined') {
            this.Text           = new Text(data.latestConversationMessage.content);
        } else {
            console.log(data.latestConversationMessage);
        }

        this.Time           = parseInt(data.latestConversationMessage.timestamp);
        this.Sender         = new User(data.latestConversationMessage.sender);
    }

    reply(text) {
        return new Promise((success, failure) => {
            let id      = Crypto.randomUUID();
            let query   = new GraphBuilder(Type.Mutation, 'MessengerSendMessage');
            query.setAuthSession(this.Client.getSession());
            query.setVariable('id',                       this.Conversation);
            query.setVariable('messageCorrelationId',     Crypto.randomUUID());
            query.setVariable('text',                     text);

            GraphQL.call(query).then((response) => {
                success(id);
            }).catch(failure);
        });
    }

    setArchived() {
        return new Promise((success, failure) => {
            let query = new GraphBuilder(Type.Mutation, 'ArchiveConversation');
            query.setAuthSession(this.Client.getSession());
            query.setVariable('id', this.Conversation);

            GraphQL.call(query).then((response) => {
                this.Visibility = 'ARCHIVED';
                success();
            }).catch(failure);
        });
    }

    setUnarchived() {
        return new Promise((success, failure) => {
            let query = new GraphBuilder(Type.Mutation, 'RestoreConversation');
            query.setAuthSession(this.Client.getSession());
            query.setVariable('id', this.Conversation);
            
            GraphQL.call(query).then((response) => {
                this.Visibility = 'NOT_ARCHIVED';
                success();
            }).catch(failure);
        });
    }

    mark(state) {
        return new Promise((success, failure) => {
            let query = new GraphBuilder(Type.Mutation, (state ? 'StarMessengerMessage' : 'UnStarMessengerMessage'));
            query.setAuthSession(this.Client.getSession());
            query.setVariable('id', this.ID);
            
            GraphQL.call(query).then((response) => {
                success();
            }).catch(failure);
        });
    }

    setReaded() {
        return new Promise((success, failure) => {
            let query = new GraphBuilder(Type.Mutation, 'MessengerMarkConversationsAsRead');
            query.setAuthSession(this.Client.getSession());
            query.setVariable('ids', [ this.Conversation ]);

            GraphQL.call(query).then((response) => {
                success();
            }).catch(failure);
        });
    }

    setUnreaded() {
        return new Promise((success, failure) => {
            let query = new GraphBuilder(Type.Mutation, 'MessengerMarkConversationAsUnread');
            query.setAuthSession(this.Client.getSession());
            query.setVariable('id', this.Conversation);

            GraphQL.call(query).then((response) => {
                success();
            }).catch(failure);
        });
    }
}