import type { ClientResponse } from "hono/client";

type ClientResponseLike = {
  json: () => Promise<any>;
  text?: () => Promise<string>;
  status: number;
  ok: boolean;
  headers: Headers;
};

type BodyOf<R> = R extends ClientResponse<infer B, any, any> ? B : never;
type DataOf<R> = Extract<BodyOf<R>, { data: unknown }> extends { data: infer D } ? D : never;

export class ApiError extends Error {
  public status: number;
  public body?: unknown;
  
  constructor(message: string, status = 0, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * validateResponse(res)
 * - infers data type from `res` (ClientResponse<...>)
 * - runtime: checks content-type json, parses, throws on { error: string }, returns data
 */
export async function validateResponse<Res extends ClientResponseLike>(
  res: Res
): Promise<DataOf<Res>> {
  if (res.status === 204 || res.status === 205) {
    throw new ApiError("No content (204/205) — response has no body", res.status);
  }

  const ct = res.headers?.get?.("content-type") ?? "";

  if (!/application\/json/i.test(ct)) {
    const txt = typeof res.text === "function" ? await res.text().catch(() => "") : "";
    throw new Error(txt || `Expected application/json response but got content-type: ${ct}`);
  }

  let parsed: unknown;

  try {
    parsed = await (res as any).json();
  } catch (e) {
    const txt = typeof res.text === "function" ? await res.text().catch(() => "") : String(e);
    
    throw new Error(`Failed to parse JSON: ${txt}`);
  }

  if (
    parsed &&
    typeof parsed === "object" &&
    "error" in (parsed as Record<string, unknown>) &&
    typeof (parsed as Record<string, unknown>)["error"] === "string"
  ) {
    throw new Error((parsed as Record<string, any>)["error"]);
  }

  if (parsed && typeof parsed === "object" && "data" in (parsed as Record<string, unknown>)) {
    return (parsed as Record<string, any>)["data"] as DataOf<Res>;
  }

  throw new Error("Unexpected response shape: expected { data: ... } | { error: string }");
}
