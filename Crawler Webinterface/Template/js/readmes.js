(new class Readmes {
	Container	= document.querySelector('div#readmes');
	Page		= 1;
	
	constructor() {
		document.querySelector('[data-action="next"]').addEventListener('click', (event) => {
			this.Page++;
			this.load();
		});
		
		this.load();
	}
	
	load() {
		new Ajax('/api/users/profiles/readmes').onSuccess((json) => {
			if(json.status === false) {
				// @ToDo Error Dialog?
				console.error(json);
				return;
			}
			
			if(typeof(json.data) === 'undefined') {
				// @ToDo Error Dialog?
				console.error(json);
				return;
			}
			
			try {
				this.Container.dataset.loading = 'false';
				this.Container.setAttribute('data-loading', 'false');
				
				if(json.data.length >= 1) {
					this.updateCounter(json.data.length);
					
					json.data.forEach((readme, index) => {
						this.addEntry(readme);
					});
				
					Extensions.tooltip(this.Container.querySelectorAll('[data-bs-toggle="tooltip"]'));
				}
			} catch(error) {
				console.error(error);
			}
		}).onError((event, title, message) => {
			console.error('Ajax', { event, title, message });
		}).get({
			page: this.Page
		});
	}
	
	updateCounter(number) {
		let formatter = new Intl.NumberFormat('de-DE');
		document.querySelector('[data-name="readmes:count"]').innerText = formatter.format(number);
	}
	
	escape(str) {
		return str.replace(/[&<>"']/g, function (char) {
			return {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
			}[char];
		});
	}

	addEntry(readme) {
		const template			= document.querySelector('template#readme');
		const clone				= template.content.cloneNode(true);
		const entry				= clone.querySelector('li.entry');
		let flags				= [];
		let suffix				= '<span class="ms-1 fw-normal">(';
		
		if(readme.age >= 1) {
			suffix += readme.age;
		}
		
		switch(readme.gender) {
			case 'MALE':
				suffix += '<i class="bi bi-gender-male ms-1"></i>';
			break;
			case 'FEMALE':
				suffix += '<i class="bi bi-gender-female ms-2"></i>';			
			break;
			case 'NONBINARY_HE':
				suffix += '<i class="bi bi-gender-trans ms-2"></i>';			
			break;
			case 'NONBINARY_SHE':
				suffix += '<i class="bi bi-gender-trans ms-2"></i>';			
			break;
			case 'UNKNOWN': break;
		}
		
		suffix += ')</span>';
		
		entry.querySelector('[data-name="id"]').innerText		= readme.id;
		entry.querySelector('[data-name="nickname"]').innerHTML	= this.escape(readme.nickname) + suffix;
		entry.querySelector('[data-name="readme"]').value		= readme.readme;
		
		entry.querySelector('[data-name="nickname"]').addEventListener('click', (event) => {
			window.open('/users/profiles/' + readme.id, '_blank');
		});
		
		readme.flags.forEach((flag) => {
			let element = null;
			
			switch(flag) {
				case 'messenger:teleguard':
					element = '<kbd class="text-white text-bg-info bg-opacity-75">Messenger-Werbung (TeleGuard)</kbd>';
				break;
				case 'messenger:snapchat':
					element = '<kbd class="text-white text-bg-info bg-opacity-75">Messenger-Werbung (Snapchat)</kbd>';
				break;
				case 'messenger:telegram':
					element = '<kbd class="text-white text-bg-info bg-opacity-75">Messenger-Werbung (Telegram)</kbd>';
				break;
				case 'messenger:instagram':
					element = '<kbd class="text-white text-bg-info bg-opacity-75">Messenger-Werbung (Instagram)</kbd>';
				break;
				case 'messenger:kik':
					element = '<kbd class="text-white text-bg-info bg-opacity-75">Messenger-Werbung (KIK)</kbd>';
				break;
				case 'messenger:other':
					element = '<kbd class="text-white text-bg-info bg-opacity-75">Messenger-Werbung</kbd>';
				break;
				case 'sexual':
					element = '<kbd class="text-white text-bg-danger bg-opacity-75">Pornografisch</kbd>';
				break;
				case 'fetish':
					element = '<kbd class="text-white text-bg-dark bg-opacity-75">Fetisch</kbd>';
				break;
				case 'financial':
					element = '<kbd class="text-bg-warning bg-opacity-75">Finanziell</kbd>';
				break;
			}
			
			if(element !== null) {
				entry.classList.add('bg-warning', 'bg-opacity-10');
				flags.push(element);				
			}
		});
		
		entry.querySelector('[data-name="flags"]').innerHTML	= flags.join('');
		
		this.Container.querySelector('ul.content').appendChild(clone);
		this.updateCounter(this.Container.querySelector('ul.content').querySelectorAll('.list-group-item').length);
	}
}());