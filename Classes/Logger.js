const Logger = {
    info: function info() {
        var elements = Array.from(arguments);
        elements.unshift('%c[K3 Bot]', 'color: #b893f6;');
        console.log.apply(console, elements);
    },
    warn: function warn() {
        var elements = Array.from(arguments);
        elements.unshift('%c[K3 Bot]', 'color: #b893f6;');
        console.warn.apply(console, elements);
    },
    error: function error() {
        var elements = Array.from(arguments);
        elements.unshift('%c[K3 Bot]', 'color: #b893f6;');
        console.error.apply(console, elements);
    },
    debug: function error() {
        var elements = Array.from(arguments);
        elements.unshift('%c[K3 Bot]', 'color: #b893f6;');
        console.debug.apply(console, elements);
    }
};
export default Logger;