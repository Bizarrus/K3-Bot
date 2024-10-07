import Logger from '../../Classes/Logger.js';

export default class HalloweenHunt {
    Thread;
    AppID = 'HalloweenhuntApp';
    Running = false;
    Command= '/hhunt collect:';
    Objects = [
        'Eimer',
        'Geist',
        'Fledermaus',
        'Schädel',
        'Katze',
        'Kürbis',
        'Hexe',
        'Hand'
    ];

    onInit() {
        Logger.info('Halloween-Hunt', 'Inited');

        this.Thread = setInterval(() => {
            this.run();
        }, 2500);
    }

    onStop() {
        if(typeof(this.Thread) !== 'undefined' && this.Thread !== null) {
            clearInterval(this.Thread);
        }
    }

    run() {
        if(this.Running) {
            return;
        }

        Logger.info(Date.now(), 'Halloween-Hunt', 'Running...');

        this.Objects.forEach((entry) => {
            this.sendCommand(this.Command + entry).then((result) => {
                Logger.info(this.Command + entry, result);
            }).catch((error) => {
                Logger.error(this.Command + entry, error);
            });
        });
    }

    onReceive(packet) {
        try {
            let data = JSON.parse(packet.Body.Request);

            if(data === null) {
                return;
            }

            if(data.operationName === 'SendAppControlPlaneEvent') {
                if(data.variables.event.appId === this.AppID) {
                    let event = data.variables.event;

                    if(event.eventKey === 'logAppLoad') {
                        this.Running = true;
                        Logger.info('Halloween-Hunt', 'Started');
                    } else if(event.eventKey === 'closed') {
                        this.Running = false;
                        Logger.info('Halloween-Hunt', 'Ended');
                    } else {
                        Logger.info('Halloween-Hunt:', data.variables.event);
                    }
                }
            }
        } catch(e) {}
    }
}