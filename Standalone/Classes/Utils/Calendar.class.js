export default new class Calendar {
   convertDate(timestamp) {
		const ts = Number(timestamp);
		
		if(isNaN(ts)) {
			return null;
		}
		
		return new Date(ts).toISOString().slice(0, 10);
	}
	
	getDate() {
		return new Date().toISOString().slice(0, 10);
	}
	
	convertToDatetime(input) {
		const [datePart, timePart]	= input.split(' ');
		const [day, month, year]	= datePart.split('.');
		
		return `${year}-${month}-${day} ${timePart}`;
	}
}();