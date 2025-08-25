import type { TimingVariables } from 'hono/timing';

export type Env = {
  Variables: {
    nickname: string
    currentSessionId: string,
    sessionToken: string;
  } & TimingVariables
}