class Action {
    Backend;

    constructor() {
        this.Backend = browser.runtime.connect({name: "K3-Bot"});

        document.querySelectorAll('[data-action]').forEach((element) => {
            element.addEventListener('click', (event) => {
                this.send("menu", element.dataset.action);
            });
        });
    }

    send(name, data) {
        this.Backend.postMessage({
            name: name,
            data: data
        });
    }
}

window.Action = new Action();