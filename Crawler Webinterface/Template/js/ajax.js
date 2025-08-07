const AjaxState = {
    NOT_INITALIZED:			0,
    CONNECTION_ESTABLISHED:	1,
    REQUEST_RECEIVED:		2,
    PROCESSING:				3,
    FINISHED:				4
};

class Ajax {
	Socket		= null;
	URL			= null;
	Callbacks	= {
		Success:	[],
		Error:		[]
	};
	
	constructor(url) {
		this.Socket						= new XMLHttpRequest();
        this.URL						= url;
        this.Socket.onreadystatechange	= this.handle.bind(this);
	}
	
	handle(event) {
		switch(this.Socket.readyState) {
            case AjaxState.NOT_INITALIZED:
            case AjaxState.CONNECTION_ESTABLISHED:
            case AjaxState.REQUEST_RECEIVED:
            case AjaxState.PROCESSING:
                /* Do currently Nothing */
            break;
            case AjaxState.FINISHED:
                if(this.Socket.readyState === 4 && this.Socket.status === 200) {
                    try {
                        let json = JSON.parse(event.target.responseText);

                        this.Callbacks.Success.forEach((callback) => {
                            try {
								callback.apply(this, [ json ]);
							} catch(exception) {
								console.error(exception);
							}
						});
                    } catch(exception) {
                        this.Callbacks.Success.forEach((callback) => {
                            callback.apply(this, [ event.target.responseText ]);
                        });
                    }
                } else {
					try {
                        let json = JSON.parse(event.target.responseText);

                        this.Callbacks.Error.forEach((callback) => {
                            callback.apply(this, [ event, json, null ]);
                        });
                    } catch(exception) {
                        this.Callbacks.Error.forEach((callback) => {
                            callback.apply(this, [ event, event.target, exception.message ]);
                        });
                    }
                }
            break;
        }
	}
	
	setHeaders() {
		this.Socket.setRequestHeader('X-Requested-With',	'XMLHttpRequest');
        this.Socket.setRequestHeader('Content-type',		'application/x-www-form-urlencoded');
	}
	
	onError(callback) {
		this.Callbacks.Error.push(callback);
        return this;
	}
	
	onSuccess(callback) {
		this.Callbacks.Success.push(callback);
        return this;
	}
	
	post(data) {
		this.Socket.open('POST', this.URL, true);
        this.setHeaders();

        this.Socket.send((typeof(data) === 'string') ? data : Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
        }).join('&'));

        return this;
	}
	
	get(query) {
		this.Socket.open('GET', this.URL + (typeof(query) === 'undefined' ? '' : '?' + (typeof(query) === 'string' ? query : Object.keys(query).map((key) => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(query[key]);
		}).join('&'))), true);
		
        this.setHeaders();
        this.Socket.send();

        return this;
	}
}