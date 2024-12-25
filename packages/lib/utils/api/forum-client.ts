import { hc } from 'hono/client';
import { user, thread, admin, headers } from 'forum-backend/src';

export const forumUserClient = hc<typeof user>('http://localhost:3500/api/', { headers });
export const forumThreadClient = hc<typeof thread>('http://localhost:3500/api/', { headers });
export const forumAdminClient = hc<typeof admin>('http://localhost:3500/api/', { headers });