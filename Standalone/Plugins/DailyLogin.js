import IPlugin from '../Classes/IPlugin.interface.js';

export default class DailyLogin extends IPlugin {
    SEARCH = /\/challenge\s([0-9\-]+)\sDailyLogin/gm;

    /*
        e.g. /challenge 6641877993205387291 DailyLogin
        Reference implementation in HTMLChat https://github.com/knuddelsgmbh/htmlchat/blob/master/src/js/encryption/Challenge.js
        Secondary reference implementation in ChatApplet `base.ChallengeResponseCommandInterceptor#visitMe`
    */
    constructor(client) {
        super();

        client.on('message', (channel, message) => {
            if(message === null) {
                return;
            }

            /* Check if the DailyLogin-String exists on the message */
            if(message.toString().indexOf('Tageslogin') !== -1) {
                let found = false;

                /* Iterate over all text segments */
                message.get().formattedText.list.items.forEach((entry) => {

                    /* If the text segment contains a smiley */
                    if(typeof(entry.smiley) !== 'undefined') {
                        let json = JSON.parse(entry.smiley.json);

                        /* Iterate over all links in the smiley */
                        json.forEach((link) => {
                            if(typeof(link.linkUrl) === 'undefined') {
                                return;
                            }

                            if(found) {
                                return;
                            }

                            /* If the link contains the DailyLogin command */
                            if(link.linkUrl.match(this.SEARCH)) {
                                try {
                                    found           = true;
                                    const matches   = this.SEARCH.exec(link.linkUrl);

                                    /*
                                        /dailylogin 1034705054191444812
                                    */
                                    /* Wait a little bit and execute the DailyLogin command */
                                    setTimeout(() => {
                                        channel.sendMessage('/dailylogin ' + this.hash(matches[1], client.getCurrentUser().getNickname()).toString(10)).catch((error) => {
                                            console.error('[DailyLogin] Error:', error);
                                        });
                                    }, 2000); // @ToDo random waiting between 2-10 seconds?
                                } catch(e) {
                                    console.error('[DailyLogin] Error:', e);
                                }
                            }
                        });
                    }
                });
            }
        });
    }

    nickHash(nickname) {
		let hash    = 0;

		for(let index = 0; index < nickname.length; index++) {
			hash        = (hash << 5) - hash + nickname.charCodeAt(index);
			hash        = hash & hash;
		}

		return hash;
	}

    hash(value, nickname) {
        const JAVA_MAX_LONG     = BigInt('9223372036854775807');
        const JAVA_MIN_LONG     = BigInt('-9223372036854775808');
        const JAVA_LONG_RANGE   = JAVA_MAX_LONG - JAVA_MIN_LONG + BigInt(1);
        const SEVEN             = BigInt(7);
        const ZERO              = BigInt(0);
        const challenge         = BigInt(value);
		const nickHash          = BigInt(this.nickHash(nickname));

        let response = (challenge * nickHash * SEVEN) % JAVA_LONG_RANGE;

		if(response < ZERO) {
			response = JAVA_LONG_RANGE + response;
		}

		if(response > JAVA_MAX_LONG) {
			response = JAVA_LONG_RANGE - response;
			response = -response;
		}

        return response;
    }
}