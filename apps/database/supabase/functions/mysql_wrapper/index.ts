import { checkAuthorization } from "../_shared/helpers/authorization.ts";
import { handleRequest } from "../_shared/helpers/request-handler.ts";
import { handleError } from "../_shared/helpers/error-handler.ts";

Deno.serve(async (req: Request) => {
	if (req.method !== "POST") {
		return new Response("Method not allowed", { status: 405 });
	}

	try {
		const authResponse = checkAuthorization(req.headers);

		if (authResponse) return authResponse;

		const requestBody = await req.json();
		
		return await handleRequest(requestBody);
	} catch (error) {
		return handleError(error);
	}
});