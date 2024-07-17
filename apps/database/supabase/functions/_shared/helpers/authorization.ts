export function checkAuthorization(
	headers: Headers
): Response | null {
	const serviceRole = Deno.env.get("SERVICE_ROLE_KEY");
	const token = headers.get("Authorization")?.split(" ")[1];

	if (!token) return new Response("Missing authorization header", {
		status: 401
	});
	
	if (token !== serviceRole) return new Response(null, {
		status: 403,
		statusText: "Not authorized"
	});

	return null;
}