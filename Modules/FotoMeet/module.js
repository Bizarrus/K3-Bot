export default class FotoMeet {
    onReceive(packet) {
        try {
            let data = JSON.parse(packet.Body.Request);

            if(data.operationName === 'SendAppDataEvent') {
                if(data.variables.event.appId === 'FotomeetApp') {
                    /* Get the User-ID from the current Photo; */
                    let fotomeet    = JSON.parse(data.variables.event.eventValue);
                    let user        = fotomeet.data.userId;

                    /* Get the real User-Data */
                    this.getUser(user).then((user) => {
                        let obj = user.user.user;

                        // Send to Client
                        this.send('FotoMeet', {
                            id:         obj.id,
                            nickname:   obj.nick
                        })
                    });
                }
            }
        } catch(e) {
        }
    }
}