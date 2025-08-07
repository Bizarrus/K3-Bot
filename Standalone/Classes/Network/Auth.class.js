import HTTPBuildQuery from 'http-build-query';
import ClientProperties from '../ClientProperties.class.js';
import Crypto from 'node:crypto';

export default class Auth {
    constructor(username, password) {
        return new Promise(async (success, failure) => {
			const controller	= new AbortController();
            const timeout		= setTimeout(() => controller.abort(), 10000);
			
			try {
                const response = await fetch(ClientProperties.get('urls.login'), {
                    method: 'POST',
                    headers: {
						'Origin':			'https://www.knuddels.de',
						'Referer':			'https://www.knuddels.de/login',
                        'Content-Type':		'application/x-www-form-urlencoded; charset=UTF-8',
                        'User-Agent':		ClientProperties.get('browser.useragent'),
                        'Accept':			'application/json',
                        'X-Requested-With':	'XMLHttpRequest',
						'Cookie':			'KnM=1;KnA=zl;'
                    },
                    body: HTTPBuildQuery({
                        nick:			username,
                        pwd:			password,
						mpDeviceId:		Crypto.randomUUID(),
                        resultAsJSON:	'true',
                        isAjax:			'true'
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeout);

                const json = await response.json();

				console.warn(json);
				
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