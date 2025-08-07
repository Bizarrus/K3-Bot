const Extensions = (new class Extensions {
	constructor() {
		this.loading();
		this.tooltip(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
		this.doublerange(document.querySelectorAll('.doublerange'));
		
		document.querySelectorAll('.grow-wrap textarea').forEach((element) => {
			element.parentNode.dataset.replicatedValue = element.value;
			
			element.addEventListener('input', () => {
				element.parentNode.dataset.replicatedValue = element.value;
			});
		});
	}
	
	loading() {
		window.addEventListener('load', () => {
			document.body.dataset.loading = 'false';
			
			setTimeout(() => {
				document.body.dataset.loading = 'hidden';
			}, 100);
		});
		
		window.addEventListener('beforeunload', () => {
			document.body.dataset.loading = 'true';
		});
	}
	
	tooltip(object) {
		if(object instanceof NodeList) {
			object.forEach((element) => {
				this.tooltip(element);
			});
		} else if(object instanceof Element) {
			try {
				new bootstrap.Tooltip(object, {
					boundary:	document.querySelector('main'),
					html:		true
				});
			} catch(e) {
				console.log(e);
			}
		}
	}
	
	doublerange(object) {
		if(object instanceof NodeList) {
			object.forEach((element) => {
				this.doublerange(element);
			});
		} else if(object instanceof Element) {
			try {
				const inputs	= object.parentNode.querySelectorAll('input[type="number"]');
				const ranges	= object.querySelectorAll('input[type="range"]');
				
				function syncFromInputs(event) {
					let minVal = parseInt(inputs[0].value);
					let maxVal = parseInt(inputs[1].value);
					
					if(minVal > maxVal) {
						[minVal, maxVal] = [maxVal + 1, minVal];
					}
					
					inputs[0].value = minVal;
					inputs[1].value = maxVal;
					ranges[0].value = minVal;
					ranges[1].value = maxVal;
				}

				function syncFromRanges() {
					let minVal = parseInt(ranges[0].value);
					let maxVal = parseInt(ranges[1].value);
					
					if(minVal > maxVal) {
						[minVal, maxVal] = [maxVal, minVal];
					}
					
					inputs[0].value = minVal;
					inputs[1].value = maxVal;
					ranges[0].value = minVal;
					ranges[1].value = maxVal;
				}

				inputs.forEach((element) => {
					element.addEventListener('change', syncFromInputs);
					element.addEventListener('input', syncFromInputs);
				});

				ranges.forEach((element) => {
					element.addEventListener('change', syncFromRanges);
					element.addEventListener('input', syncFromRanges);
				});
			} catch(e) {
				console.log(e);
			}
		}
	}
}());