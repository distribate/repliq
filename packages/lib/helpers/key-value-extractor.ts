export function keyValueExtractor(
	raw: string | undefined
): Record<string, number | string> | null {
	if (!raw) return null;
	
	const pairs: string[] = raw.split(';');
	const parsedObject: Record<string, number | string> = {};
	
	pairs.forEach(pair => {
		const [key, value] = pair.split('%%');
		
		const numericValue = parseFloat(value);
		parsedObject[key] = isNaN(numericValue) ? value : numericValue;
	});
	
	return parsedObject;
}