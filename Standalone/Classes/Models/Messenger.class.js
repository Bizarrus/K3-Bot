import { GraphQL, Type } from '../Network/GraphQL.class.js';
import GraphBuilder from '../Network/GraphBuilder.class.js';
import Message from './Message.class.js';

export default class Messenger {
    Client      = null;
    Messages    = [];

    constructor(client) {
        this.Client = client;

        this.Client.on('connected', () => {
            this.getMessages().then((messages) => {
                this.Messages = messages;
                this.Client.emit('messages', this.Messages);
            }).catch((error) => {
                console.error('[Messenger] Can\'t receive Messages:', error);
            });
        });
    }

    getArchivedMessages() {
        return this.internalGetMessages('ARCHIVED', 20);
    }

    getUnarchivedMessages() {
        return this.internalGetMessages('NOT_ARCHIVED', 20);
    }

    getUnreadedMessages() {
        return this.internalGetMessages('UNREAD', 20);
    }

    getMessages() {
        return Promise.all([
            this.getArchivedMessages(),
            this.getUnarchivedMessages(),
            this.getUnreadedMessages()
        ]).then(results => {
            return results.flat();
        }).catch(error => {
            throw error;
        });
    }

    getRandomMessage() {
        if(this.Messages.length === 0) {
            return null;
        }

        return this.Messages[Math.floor(Math.random() * this.Messages.length)];
    }

    internalGetMessages(filter, limit) {
        return new Promise((success, failure) => {
            let graph = new GraphBuilder(Type.Query, 'MessengerOverview');
            graph.addFragment('FullConversationWithoutMessages');
            graph.addFragment('MessengerOverviewUser');
            graph.addFragment('MessengerBasicUser');
            graph.addFragment('ProfilePictureOverlays');
            graph.addFragment('ProfileTag');
            graph.addFragment('ConversationMessage');
            graph.addFragment('ConversationMessageContent');
            graph.addFragment('ConversationTextMessageContent');
            graph.addFragment('ConversationQuotedMessageContent');
            graph.addFragment('ConversationNestedMessage');
            graph.addFragment('ConversationNestedMessageContent');
            graph.addFragment('ConversationForwardedMessageContent');
            graph.addFragment('ConversationImageMessageContent');
            graph.addFragment('ConversationSnapMessageContent');
            graph.addFragment('ConversationVisiblePhotoCommentMessageContent');
            graph.addFragment('ConversationHiddenPhotoCommentMessageContent');
            graph.addFragment('ConversationDeletedPhotoCommentMessageContent');
            graph.addFragment('ConversationKnuddelTransferMessageContent');
            graph.addFragment('ConversationMentorAchievedMessageContent');
            graph.addFragment('ConversationPrivateSystemMessageContent');
            graph.addFragment('ConversationBirthdayMessageContent');
            graph.addFragment('ConversationNicknameChangeMessageContent');
            graph.setVariable('before',         null);
            graph.setVariable('filterByState',  filter);
            graph.setVariable('limit',          limit);
            graph.setVariable('pixelDensity',   1);
            graph.setAuthSession(this.Client.getSession());
    
            GraphQL.call(graph).then((response) => {
                let messages = [];

                response.messenger.conversations.conversations.forEach((entry) => {
                    messages.push(new Message(this.Client, entry));
                });

                success(messages);
            }).catch(failure);
        });
    }
}