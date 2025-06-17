import { GraphQL, Type } from './GraphQL.class.js';

export default class GraphBuilder {
    Data        = [];
    Name        = null;
    Variables   = {};
    AuthToken   = null;

    constructor(type, name) {
        this.Name = name;

        switch(type) {
            case Type.Query:
                this.Data.push(GraphQL.getQuery(name));
            break;
            case Type.Mutation:
                this.Data.push(GraphQL.getMutation(name));
            break;
            case Type.Subscription:
                this.Data.push(GraphQL.getSubscription(name));
            break;
        }
    }

    getName() {
        return this.Name;
    }

    setAuthSession(session) {
		if(session === null) {
			return null;
		}
		
        let token = session.getConnectionToken();

        if(token === null) {
            token = session.getLoginToken();
        }

        this.AuthToken = token;
    }

    setAuthToken(token) {
        this.AuthToken = token;
    }

    getAuthToken() {
        return this.AuthToken;
    }

    hasAuthToken() {
        return (this.AuthToken !== null && this.AuthToken.length > 10);
    }

    addFragment(name) {
        this.Data.push(GraphQL.getFragment(name));
    }

    setVariable(name, value) {
        this.Variables[name] = value;
    }

    getVariables() {
        return this.Variables;
    }

    toString() {
        return this.Data.join("\n\n");
    }
}