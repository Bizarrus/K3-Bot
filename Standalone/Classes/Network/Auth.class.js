import HTTPBuildQuery from 'http-build-query';
import ClientProperties from '../ClientProperties.class.js';

export default class Auth {
    constructor(username, password) {
        return new Promise(async (success, failure) => {
			const controller	= new AbortController();
            const timeout		= setTimeout(() => controller.abort(), 10000);
			
			try {
                const response = await fetch(ClientProperties.get('urls.login'), {
                    method: 'POST',
                    headers: {
                        'Content-Type':		'application/x-www-form-urlencoded; charset=UTF-8',
                        'User-Agent':		ClientProperties.get('browser.useragent'),
                        'Accept':			'application/json, text/javascript, */*; q=0.01',
                        'X-Requested-With':	'XMLHttpRequest'
                    },
                    body: HTTPBuildQuery({
                        nick:			username,
                        pwd:			password,
                        resultAsJSON:	true,
                        isAjax:			true
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeout);

                const json = await response.json();

                if(json?.error) {
					return failure(json.error);
                }
				
				if(json?.jwt) {
					return success(json.jwt);
				}
				
                return failure('Unknown JSON-Response');
            } catch (error) {
                clearTimeout(timeout);
                return failure(error);
            }
        });
    }
}