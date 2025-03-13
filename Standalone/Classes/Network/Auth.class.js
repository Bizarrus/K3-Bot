import Fetch from 'node-fetch';
import HTTPBuildQuery from 'http-build-query';
import ClientProperties from '../ClientProperties.class.js';

export default class Auth {
    constructor(username, password) {
        return new Promise(async (success, failure) => {
            Fetch(ClientProperties.get('urls.login'), {
                method:     'POST',
                headers:    {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body:   HTTPBuildQuery({
                    nick:           username,
                    pwd:            password,
                    resultAsJSON:   true,
                    isAjax:         true
                })
            }).then((response) => {
                response.json().then((json) => {
                    if(typeof(json.error) !== 'undefined') {
                        failure(json.error);
                        return;
                    }
        
                    if(typeof(json.jwt) !== 'undefined') {
                        success(json.jwt);
                        return;
                    }

                    failure(null);
                }).catch(failure);
            }).catch(failure);
        });
    }
}