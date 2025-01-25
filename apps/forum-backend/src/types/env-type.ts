import type { Promisify, RateLimitInfo } from "hono-rate-limiter";

export type Env = {
  Variables: {
    nickname: string,
    rateLimit: RateLimitInfo;
    rateLimitStore: {
      get?: (key: string) => Promisify<RateLimitInfo | undefined>;
      resetKey: (key: string) => Promisify<void>;
    };
  }
}