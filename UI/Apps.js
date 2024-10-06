class Apps {
    constructor() {
        let location = window.location.href;

        if(!location.match(/(\/apploader\/)/)) {
            console.log("APPLOADER", window.Bridge);
            return;

        } else if(!location.match(/(chatproxy\.knuddels\.de\/apps)/)) {
            console.error("NOT AN APP!", location);
            return;
        }

        console.error("Injected in App!");

    }
}

window.Apps = new Apps();