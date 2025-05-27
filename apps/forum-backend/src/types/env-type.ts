import type { Promisify, RateLimitInfo } from "hono-rate-limiter";
import type { TimingVariables } from 'hono/timing'

export type Env = {
  Variables: {
    nickname: string ,
    rateLimit: RateLimitInfo;
    rateLimitStore: {
      get?: (key: string) => Promisify<RateLimitInfo | undefined>;
      resetKey: (key: string) => Promisify<void>;
    }
  } & TimingVariables
}