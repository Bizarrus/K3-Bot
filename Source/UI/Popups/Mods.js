class Mods {
    constructor() {

    }

    getCurrentWindow() {
        return browser.windows.getCurrent();
    }

    close() {
        this.getCurrentWindow().then((current) => {
            browser.windows.remove(current.id);
        });
    }
}

window.Mods = new Mods();