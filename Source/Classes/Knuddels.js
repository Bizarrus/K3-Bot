export default (new class Knuddels {
    URL;
    Token;
    CurrentChannel;

    constructor() {
        this.Token = null;
        this.CurrentChannel = null;
        this.URL = 'https://api-de.knuddels.de/api-gateway/graphql';
    }

    setCurrentChannel(channel) {
        this.CurrentChannel = channel;
    }

    getCurrentChannel() {
        return this.CurrentChannel;
    }

    setToken(token) {
        this.Token = token;
    }

    sendPrivateMessage(core, nickname, message) {
        return this.sendPublicMessage(core, '/p ' + nickname + ':' + message);
    }
    sendCommand(core, command) {
        return this.sendPublicMessage(core, command);
    }

    sendPublicMessage(core, message) {
        return core.send('send', {
            token:  this.Token,
            data: {
                operationName: 'SendMessage',
                variables: {
                    channelId: this.CurrentChannel,
                    text: message
                },
                query: 'mutation SendMessage($channelId: ID!, $text: String!) {\n  channel {\n    sendMessage(id: $channelId, text: $text) {\n      error\n      __typename\n    }\n    __typename\n  }\n}\n'
            }
        });
    }

    getUser(core, user_id) {
        return core.send('send', {
            token:  this.Token,
            data: {
                operationName: 'GetUserForProfile',
                variables: {
                    userId: user_id
                },
                query: 'query GetUserForProfile($userId: ID!) {\n  user {\n    user(id: $userId) {\n      ...UserForProfile\n      __typename\n    }\n    __typename\n  }\n  messenger {\n    conversationWithParticipants(otherParticipantIds: [$userId]) {\n      id\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment UserForProfile on User {\n  id\n  nick\n  age\n  gender\n  sexualOrientation\n  relationshipStatus\n  city\n  distance\n  canReceiveMessages\n  profilePicture {\n    urlLargeSquare\n    urlVeryLarge\n    exists\n    __typename\n  }\n  albumPhotosUrl\n  readMe\n  name\n  dateOfBirth\n  country\n  children\n  smoker\n  hobbies\n  music\n  movies\n  series\n  books\n  languages\n  lastOnlineTime\n  dateOfRegistration\n  status\n  supportsKnuddelsPhilosophy\n  teams\n  stammiMonths\n  latestOnlineChannelName\n  myChannelName\n  moderatedChannelName\n  moderatedMyChannelNames\n  hickeys\n  flowers\n  roses\n  chatMeetups\n  receivedHearts\n  givenHeart\n  mentorPoints\n  onlineMinutes\n  isReportable\n  __typename\n}\n'
            }
        });
    }
}());