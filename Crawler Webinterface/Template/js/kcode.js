(new class KCode {
	Parser			= null;
	Configuration	= {
		allowBold:				true,
		allowBreaklines:		true,
		allowLinks:				true,
		allowItalic:			true,
		allowFontSize:			true,
		allowColor:				true,
		allowImages:			true,
		allowAlignment:			true,
		allowIndentation:		true,
		defaultFontSize:		16,
		defaultTextColor:		'0,0,0',
		defaultLinkHoverColor:	'0,0,255',
		channelRed:				'150,0,0',
		channelGreen:			'0,150,0',
		channelBlue:			'0,0,150'
	};

	constructor() {
		window.KCode.setRelativeURLRewriteFunction(this.rewriteURL);
		this.Parser = new window.KCode.Parser();
		
		for(let key in this.Configuration) {
			this.Parser[key] = this.Configuration[key];
		}
		
		document.querySelectorAll('.kcode').forEach((element) => {
			let result			= this.Parser.parse(element.innerText);
			element.innerHTML	= result.htmlString;
			this.onLink(result.linkingActions);
		});
		
		document.querySelectorAll('.jsonformat').forEach((element) => {
			this.convertToKCode(element);
		});
	}
	
	convertToKCode(element) {
		let json	= JSON.parse(element.innerText);
		let kcode	= [];
		
		if(typeof(json.list) !== 'undefined') {
			if(typeof(json.list.items) !== 'undefined') {
				json.list.items.forEach((item) => {
					if(typeof(item.link) !== 'undefined') {
						let entry = item.link;
						
						kcode.push(...this.startFormat(entry));
						kcode.push('°>' + entry.text + '|' + entry.href + '<°');
						kcode.push(...this.endFormat(entry));
						
					} else if(typeof(item.smiley) !== 'undefined') {
						let entry = item.smiley;
						
						kcode.push(...this.startFormat(entry));
						kcode.push(...this.imageFormat(entry.json));
						kcode.push(...this.endFormat(entry));
					} else if(typeof(item.text) !== 'undefined') {
						let entry = item.text;
					
						/* Ignoring Topic-Message */
						if(entry.text.indexOf('Dieser Channel hat folgendes Thema:') !== -1) {
							return;
						}
						
						kcode.push(...this.startFormat(entry));
						
						if(entry.text === '\n') {
							kcode.push('°#°');
						} else {
							kcode.push(entry.text);
						}
						
						kcode.push(...this.endFormat(entry));
					} else {
						console.warn('UNKNOWN', item);
					}
				});
				
				let string			= kcode.join('').replaceAll('°>LEFT<°°#°°>LEFT<°', '');
				let result			= this.Parser.parse(string);
				let textarea		= element.closest('.tab-content').querySelector('textarea');
				element.innerHTML							= result.htmlString;
				textarea.value								= string;
				textarea.parentNode.dataset.replicatedValue	= textarea.value;
				this.onLink(result.linkingActions);
			}
		}
	}
	
	startFormat(entry) {
		let kcode = [];
		
		if(typeof(entry.alignment) !== 'undefined') {
			kcode.push('°>' + entry.alignment + '<°');
		}
		
		if(typeof(entry.bold) !== 'undefined' && entry.bold) {
			kcode.push('_');
		}
		
		if(typeof(entry.italic) !== 'undefined' && entry.italic) {
			kcode.push('"');
		}
		
		if(typeof(entry.color) !== 'undefined' && entry.color) {
			//kcode.push('°[RGB?]°');
			console.warn('COLOR?', entry.color);
		}
		
		return kcode;
	}
	
	endFormat(entry) {
		let kcode = [];
		
		if(typeof(entry.italic) !== 'undefined' && entry.italic) {
			kcode.push('"');
		}
		
		if(typeof(entry.bold) !== 'undefined' && entry.bold) {
			kcode.push('_');
		}
		
		return kcode;
	}
	
	imageFormat(data) {
		let kcode = [];
		
		try {
			let images = JSON.parse(data);
			
			images.forEach((image) => {
				console.log();
				
				kcode.push('°>');				
				if(typeof(image.pseudoCSS) !== 'undefined') {
					if(Object.keys(image.pseudoCSS).length > 0) {
						kcode.push(image.url.substring(0, image.url.lastIndexOf('.')));
						kcode.push('..');
						
						for(let name in image.pseudoCSS) {
							kcode.push('.' + name + '_' + image.pseudoCSS[name]);
						}
						
						kcode.push('.');
						kcode.push(image.url.substring(image.url.lastIndexOf('.') + 1));
					} else {
						kcode.push(image.url);
					}
				} else {
					kcode.push(image.url);
				}
				
				kcode.push('<°');
			});
		} catch(e) {
			console.error(e);
		}
		
		return kcode;
	}
	
	rewriteURL(url) {
		return '//chat.knuddels.de/pics/' + url;
	}
	
	onLink(links) {
		links.forEach((action) => {
			switch(action.type) {
				case window.KCode.LinkingAction.START_BACKGROUND_AD:
				case window.KCode.LinkingAction.PLAY_SOUND:
				case window.KCode.LinkingAction.IMG_LOAD_EVT:
				case window.KCode.LinkingAction.ADD_TEXTPANEL_SENDBACK_COMPONENT:
					/* Not implemented */
				break;
				case window.KCode.LinkingAction.LINK:
					document.querySelector('#' + action.elemID).addEventListener('click', () => {
						if(action.linkHref.indexOf('/') === 0) {
							console.log('executeSlashCommand', action.linkHref);
						} else {
							window.open(action.linkHref);
						}
					});
				break;
				default:
					console.warn('[KCode]', 'Unknown Linking-Type:', action);
				break;
			}
		});
		
		window.KCode.processLinkingActions(links);
	}
}());