import * as Events from 'node:events';
import { GraphQL, Type } from '../Network/GraphQL.class.js';
import GraphBuilder from '../Network/GraphBuilder.class.js';

export default class Channel extends Events.EventEmitter {
    Client  = null;
    ID      = null;
    Name    = null;
    Topic   = null;
    Style   = {
        Image: null,
        Color: null
    };
    Parent      = null;
    Subchanels  = [];
    Users       = {};

    constructor(client) {
        super();

        this.Client = client;
    }
    
    init(id, name) {
        this.ID     = id;
        this.Name   = name;
    }

    getID() {
        return this.ID;
    }

    getName() {
        return this.Name;
    }

    getTopic() {
        return this.Topic;
    }

    setTopic(text) {
        this.Topic = text;
    }

    hasTopic() {
        return !(typeof(this.Topic) === 'undefined' || this.Topic === null || this.Topic.length >= 1);
    }

    setStyle(image, color) {
        this.Style.Image = image;
        this.Style.Color = color;
    }

    addSubchannel(id, name) {
        let channel     = new Channel(this.Client);
        channel.Parent  = this;

        channel.init(id, name);
        channel.setTopic(this.Topic);
        channel.setStyle(this.Style.Image, this.Style.Color);

        this.Subchanels.push(channel);

        return channel;
    }

    getSubchannels() {
        return this.Subchanels;
    }

    addUser(user) {
        this.Users[user.ID] = user;
    }

    getUsers() {
        return this.Users;
    }

    join(password, confirmed) {
        if(typeof(password) === 'undefined') {
            password = null;
        }
		
        if(typeof(confirmed) === 'undefined') {
            confirmed = false;
        }

        return new Promise((success, failure) => {
            let graph = new GraphBuilder(Type.Mutation, 'JoinChannelByName');
            graph.addFragment('ActiveChannel');
            graph.addFragment('ChannelUser');
            graph.addFragment('Color');
            graph.addFragment('ChannelJoinError');  
            graph.setVariable('name',       this.Name);
            graph.setVariable('confirmed',  confirmed);
            graph.setVariable('password',   password);
            graph.setAuthSession(this.Client.getSession());
    
            GraphQL.call(graph).then((response) => {
                if(response.channel.joinByName.error !== null) {
                    if(typeof(response.channel.joinByName.error.type) !== 'undefined') {
                        switch(response.channel.joinByName.error.type) {
                            case 'OTHER':
                                failure(response.channel.joinByName.error.freetext);
                            break;
                            default:
                                failure(response.channel.joinByName.error);
                            break;
                        }
                    } else {
                        failure(response.channel.joinByName.error);
                    }
                    return;
                }

                response.channel.joinByName.channel.users.forEach((user) => {
                    this.addUser({
                        ID:         user.id,
                        Nickname:   user.nick,
                        Age:        user.age,
                        Gender:     user.gender,
                        Picture:    user.profilePicture.urlLargeSquare
                    });
                });

                if(response.channel.joinByName.error === null) {
                    this.Client.setCurrentChannel(this);
                    success();
                } else {
                    failure(response.channel.joinByName.error);
                }
            }).catch(failure);
        });
    }

    sendMessage(message) {
        return new Promise((success, failure) => {
            let graph = new GraphBuilder(Type.Mutation, 'SendMessage');
            graph.setVariable('channelId',  this.ID);
            graph.setVariable('text',       message);
            graph.setAuthSession(this.Client.getSession());
    
            GraphQL.call(graph).then((response) => {
                if(response.channel.sendMessage.error === null) {
                    success();
                } else {
                    failure(response.channel.sendMessage.error);
                }
            }).catch(failure);
        });
    }
}