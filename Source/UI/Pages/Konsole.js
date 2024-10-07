class Konsole {
    constructor() {
        this.Backend = browser.runtime.connect({ name: "K3-Bot"});
        this.Logger = document.querySelector('#logger');
        this.Details = this.Logger.parentNode.querySelector('tfoot');
        this.checkTheme();

        this.Backend.onMessage.addListener((packet) => {
            switch(packet.name) {
                case 'send':
                    console.log(packet);
                    //this.addCommunication(packet.data);
                break;
                case 'socket':
                    console.log(packet);
                    this.addCommunication(packet.data);
                break;
                default:
                    console.warn('Unhandled Packet:', packet.name, packet.data);
                break;
            }
        });
    }

    send(name, data) {
        this.Backend.postMessage({
            name: name,
            data: data
        });
    }

    checkTheme() {
        const documentElement = document.documentElement;

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
                documentElement.classList.add('theme-dark');
            } else {
                documentElement.classList.remove('theme-dark');
            }
        });

        if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
            documentElement.classList.add('theme-dark');
        } else {
            documentElement.classList.remove('theme-dark');
        }
    }

    formatDate(int) {
        let date = new Date(int);

        return date.toLocaleTimeString();
    }

    getOperator(data) {
        try {
            let json = JSON.parse(data.Body.Request);

            return json.operationName;
        } catch(e) {
            console.warn("getOperator", e, data);
        }

        return 'Unknown';
    }

    getInitiator(data) {
        return '<small>&lt;unknown&gt;</small>';
    }

    convertByte(bytes, si=false, dp=1) {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10**dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


        return bytes.toFixed(dp) + ' ' + units[u];
    }

    addCommunication(data) {
        // Ignore OPTION calls
        if(data.Method === 'OPTIONS') {
            return;
        }

        let entry = document.createElement('tr');
        entry.dataset.data = data;
        let html = '';
        let color = '';

        switch(data.Type) {
            case 'WebSocket':
                color = 'yellow';
                break;
            case 'GraphQL':
                color = 'green';
                break;
        }

        html += '<td data-size="time">' + this.formatDate(data.Time) + '</td>';
        html += '<td data-size="type"><ui-badge data-color="' + color + '">' + data.Type + '</ui-badge></td>';
        html += '<td data-size="operation">' + this.getOperator(data) + '</td>';
        html += '<td data-size="initiator">' + this.getInitiator(data) + '</td>';
        html += '<td data-size="send">' + this.convertByte(data.Bytes.Send) + '</td>';
        html += '<td data-size="receive">' + this.convertByte(data.Bytes.Receive) + '</td>';

        entry.innerHTML = html;

        this.Logger.appendChild(entry);

        entry.addEventListener('click', (event) => {
            this.showCommunication(data);
        }, false);
    }

    showCommunication(data) {
        if(data.Body.Request === null) {
            console.log("showCommunication", "EMPTY", data);
            return;
        }

        this.Details.innerHTML = '';

        let json = JSON.parse(data.Body.Request);

        this.Details.classList.remove('hide');

        let html = document.createElement('tr');
        html.innerHTML = '<td><label>Operation</label></td><td>' + json.operationName + '</td>';
        this.Details.appendChild(html);

        html = document.createElement('tr');
        html.innerHTML = '<td><label>Variablen</label></td><td>' + this.createVariables(json.variables) + '</td>';
        this.Details.appendChild(html);

        html = document.createElement('tr');
        html.innerHTML = '<td><label>Abfrage</label></td><td><pre>' + json.query + '</pre></td>';
        this.Details.appendChild(html);
    }

    createVariables(variables) {
        let html = '';

        if(variables.length == 0) {
            html += '<i>Keine Daten</i>';
        } else {
            Object.keys(variables).forEach((key) => {
                let value = variables[key];

                switch(typeof(value)) {
                    case 'string':
                        value = '<i>"' + value + '"</i>';
                    break;
                    case 'boolean':
                    case 'number':
                        value = value;
                    break;
                    case 'object':
                        value = '<pre>' + JSON.stringify(value, null, 2) + '</pre>';
                    break;
                    default:
                        console.warn('Unsupported Data:', typeof(value), value);
                    break;
                }
                html += '<ui-pair><ui-key>' + key + ':</ui-key> <ui-value>' + value + '</ui-value></ui-pair>';
            });
        }

        return html;
    }
}

new Konsole();