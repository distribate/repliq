type JsonResponse = {
	status: number;
	statusText?: string;
	body?: any;
	headers?: HeadersInit;
};

export function createResponse({
	status,
	statusText,
	body,
	headers,
}: JsonResponse): Response {
	return new Response(JSON.stringify(body), {
		status,
		statusText,
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
	});
}