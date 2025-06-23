import Chalk from 'chalk';
import {template} from 'chalk-template';
import StackTrace from 'stacktrace-js';

const Logger = {
    success: function success() {
        this.__display(['success', ...arguments]);
    },
	warning: function warning() {
        this.__display(['warning', ...arguments]);
    },
    danger: function danger() {
        this.__display(...['danger', ...arguments]);
    },
    info: function info() {
        this.__display.apply(console, [ 'info', ...arguments]);
    },
    warn: function warn() {
        this.__display.apply(console, [ 'warn', ...arguments]);
    },
    error: function error() {
        this.__display.apply(console, [ 'error', ...arguments]);
    },
    debug: function error() {
        this.__display.apply(console, [ 'debug', ...arguments]);
    },
    log: function log() {
       this.__display.apply(console, [ 'log', ...arguments]);
    },
    __display: function __display() {
        var elements  = Array.from(arguments);
        let output    = elements.shift();
        let type;
        let color;

        switch(output) {
            case 'error':
                type = 'ERROR';
                color = '#971616';
            break;
            case 'info':
                type = 'Info';
                color = '#244493';
            break;
            case 'success':
                type = 'Info';
                color = '#008000';
            break;
            case 'danger':
                type = 'Info';
                color = '#971616';
            break;
            case 'warning':
                type = 'Info';
                color = '#a88516';
            break;
            case 'warn':
                type = 'WARNING';
                color = '#a88516';
            break;
            case 'log':
                type = elements.shift();
                color = '#232325';
            break;
            case 'debug':
                type = elements.shift();
                color = '#d16f07';
            break;
            default:
                type = elements.shift();
                color = '#DEADED';
            break;
        }

		if(typeof(type) === 'undefined') {
			return;
		}
		
        elements.unshift(Chalk.hex(color)('[' + type + ']'));

        if(output === 'debug') {
            let trace = StackTrace.getSync();
            trace.shift();
            trace.shift();
            trace.forEach((entry) => {
                elements.push('\n' + Chalk.hex('#3a250f')(entry.source));
            });
        }

        elements.forEach((entry, index) => {
            if(typeof(entry) === 'string') {
                entry = entry.replaceAll('\\', '\\\\');

                try {
                    entry = template(entry);
                } catch(e) {
                    try {
						if(typeof(JSON.parse(entry)) == "object"){
							entry = Chalk.hex('#444444')(entry);
						}
					} catch(e2) {
						
					}
                }
                
                elements[index] = entry;
            }
        });

		if(typeof(elements) === 'undefined') {
			return;
		}

		if(typeof(output) === 'function') {
			this[output].apply(this, elements);
			return;
		}
        
		console.log(...elements);		
    }
};

export default Logger;