import { gql, request, GraphQLClient } from 'graphql-request';
import ClientProperties from '../ClientProperties.class.js';
import FS from 'fs';

export const Type = {
  Query:        0,
  Mutation:     1,
  Subscription: 2
};

export const GraphQL = (new class GraphQL {
  Cache = {
    Enums:          {},
    Fragments:      {},
    Querys:         {},
    Mutations:      {},
    Subscriptions:  {}
  };

  constructor() {
    this.reload();
  }

  reload() {
    if(FS.existsSync('../Protocol/')) {
      console.error('ERROR:', 'Protocol directory not exists.');
      return;
    }

    let count = 0;

    FS.readdirSync('./Protocol/').map(file => {
      [
        'enum',
        'fragment',
        'query',
        'mutation',
        'subscription'
      ].map((type) => {
        if (file.endsWith('.' + type)) {
          let name = file.replace('.' + type, '');
          let content = FS.readFileSync('./Protocol/' + file, 'utf8');
          this.Cache[type.charAt(0).toUpperCase() + type.slice(1) + 's'][name] = content;
        }

        ++count;
      });
    });

    console.info('[Protocol] Loaded ' + count + ' Scheme-Files.');
  }

  get(type, name, fragments) {
		if(typeof(this.Cache[type.charAt(0).toUpperCase() + type.slice(1) + 's'][name]) === 'undefined') {
			throw Error('[Scheme] Cant find ' + type + ' "' + name + '".');
		}
		
		let content = this.Cache[type.charAt(0).toUpperCase() + type.slice(1) + 's'][name];
		
		if(typeof(fragments) !== 'undefined' && fragments !== null) {
			content += '\n';
			
			fragments.map(fragment => {
				content += '\n' + this.getFragment(fragment);
			});
		}
		
		return content;
	}
	
	getEnum(name) {
		return this.get('enum', name);
	}
	
	getFragment(name) {
		return this.get('fragment', name);
	}
	
	getQuery(name, fragments) {
		return this.get('query', name, fragments);
	}
	
	getMutation(name, fragments) {
		return this.get('mutation', name, fragments);
	}
	
	getSubscription(name, fragments) {
		return this.get('subscription', name, fragments);
	}

  call(builder) {
    return new Promise(async (success, failure) => {
      let headers = new Map();
      headers.set('Accept-Language',  'de,en-US;q=0.7,en;q=0.3');
      headers.set('Content-Type',     'application/json');
      headers.set('Origin',           ClientProperties.get('urls.origin'));
      headers.set('Referer',          ClientProperties.get('urls.referer'));
      headers.set('User-Agent',       ClientProperties.get('browser.useragent'));
      
      if(builder.hasAuthToken()) {
        headers.set('Authorization',    'Bearer ' + builder.getAuthToken());
      }

      request({
        url:            ClientProperties.get('urls.graph'),
        document:       builder.toString(),
        variables:      JSON.parse(JSON.stringify(builder.getVariables())),
        requestHeaders: Object.fromEntries(headers),
      }).then(success).catch(failure);
    });
  }
}());