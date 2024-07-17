export function getTimestampz() {
	let now = new Date();
	
	let year = now.getFullYear();
	let month = String(now.getMonth() + 1).padStart(2, '0');
	let day = String(now.getDate()).padStart(2, '0');
	let hours = String(now.getHours()).padStart(2, '0');
	let minutes = String(now.getMinutes()).padStart(2, '0');
	let seconds = String(now.getSeconds()).padStart(2, '0');
	let milliseconds = String(now.getMilliseconds()).padStart(3, '0');
	
	let fraction = (milliseconds + "000000").slice(0, 6);
	
	let timezoneOffset = now.getTimezoneOffset();
	let sign = timezoneOffset > 0 ? '-' : '+';
	
	timezoneOffset = Math.abs(timezoneOffset);
	
	let hoursOffset = String(
		Math.floor(timezoneOffset / 60)).padStart(2, '0'
	);
	
	let minutesOffset = String(timezoneOffset % 60).padStart(2, '0');
	
	let timezone = `${sign}${hoursOffset}:${minutesOffset}`;
	
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${fraction}${timezone}`;
}