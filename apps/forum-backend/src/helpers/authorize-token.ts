import { HTTPException } from "hono/http-exception";

type AuthorizeToken = {
  authHeader: string | undefined;
  apiKey: string;
};

export function authorizeToken({ apiKey, authHeader }: AuthorizeToken) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, {
      message: "Missing or invalid Authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  if (token !== apiKey) {
    throw new HTTPException(403, { message: "Forbidden: Invalid API key" });
  }
}
