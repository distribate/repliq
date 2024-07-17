export function handleError(
	error: any
): Response {
	console.error(error);

	return new Response(JSON.stringify({
		error: "An error occurred"
	}), {
		status: 500,
		headers: {
			"Content-Type": "application/json"
		},
	});
}