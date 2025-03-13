export default class Text {
    Message = null;
    
    constructor(message) {
        this.Message = message;

        if(typeof(this.Message) === 'undefined') {
            this.Message = null;
        }

        try {
            if(this.Message !== null) {
                this.Message.formattedText = JSON.parse(this.Message.formattedText);
            }
        } catch(e) {
            console.warn("[Text]", e, this.Message);
        }
    }

    get() {
        return this.Message;
    }

    getNick() {
        return this.Message.sender.nick;
    }

    getString(entry, placeholder) {
        if(typeof(placeholder) === 'undefined') {
            placeholder = false;
        }

        if(typeof(entry.text) !== 'undefined') {
            return entry.text.text;
        } else if(typeof(entry.smiley) !== 'undefined') {
            return '<PIC>';
        } else if(typeof(entry.link) !== 'undefined') {
            if(placeholder) {
                return '<LINK>';
            } else {
                return entry.link.text;
            }
        } else {
            console.warn(entry);
        }

        return '';
    }

    toString(placeholder) {
        let text = [];

        if(this.Message !== null) {
            try {
                if(typeof(this.Message.formattedText.list) !== 'undefined') {
                    this.Message.formattedText.list.items.forEach((entry) => {
                        text.push(this.getString(entry, placeholder));
                    });
                } else {
                    text.push(this.getString(this.Message.formattedText, placeholder));
                }
            } catch(e) {
                console.warn("ERR", e, this.Message);
            }
        }

        return text.join('');
    }
}