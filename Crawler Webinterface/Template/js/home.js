(new class Home {
	constructor() {
		this.load();
	}
	
	load() {
		setTimeout(() => {
			new Ajax('/api/statistics').onSuccess((json) => {
				if(json.status === false) {
					// @ToDo Error Dialog?
					console.error(json);
					this.load();
					return;
				}
				
				if(typeof(json.data) === 'undefined') {
					// @ToDo Error Dialog?
					console.error(json);
					this.load();
					return;
				}
				
				try {
					for(let name in json.data) {
						this.updateValue('count:' + name, json.data[name]);
					}
					
					json.data.genders.forEach((gender) => {
						this.updateValue('count:' + gender.type, gender.value);
					});
					
					json.data.visits.forEach((visit) => {
						this.updateValue('count:' + visit.month, visit.users);
					});
				
					Extensions.tooltip(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
					this.load();
				} catch(error) {
					console.error(error);
					this.load();
				}
			}).onError((event, title, message) => {
				console.error('Ajax', { event, title, message });
				this.load();
			}).get();
		}, 5000);
	}
	
	updateValue(name, value) {
		if(typeof(value) === 'undefined') {
			return;
		}
		
		let element = document.querySelector('[data-name="' + name + '"]');
		
		if(typeof(element) !== 'undefined' && element !== null) {
			let oldValue = parseInt(element.innerText.replaceAll('.', '')) || 0;
			let newValue = parseInt((value + '').replaceAll('.', '')) || 0;

			if(newValue > oldValue) {
				element.innerText = value.toLocaleString('de-DE', {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				});
				
				this.showXPBadge(element, (newValue - oldValue).toLocaleString('de-DE', {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				}));
			} else {
				element.innerText = value.toLocaleString('de-DE', {
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				});
			}
		}
	}
	
	showXPBadge(element, difference) {
		const badge		= document.createElement('div');
		badge.className = 'xp-badge';
		badge.innerText = `+${difference}`;

		const rect				= element.getBoundingClientRect();
		badge.style.left		= (rect.right + window.scrollX) + 'px';
		badge.style.top			= (rect.top + window.scrollY) + 'px';

		document.body.appendChild(badge);

		setTimeout(() => {
			badge.remove();
		}, 6000);
	}
}());