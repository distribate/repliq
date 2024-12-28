import { ForumUserAppType, ForumThreadAppType, ForumAdminAppType } from 'forum-backend/src';
import { hc } from 'hono/client';

const headers = { Authorization: `Bearer ${process.env.SECRET_TOKEN}` };

export const forumUserClient = hc<ForumUserAppType>(`http://localhost:4101/api/`, { headers })
export const forumThreadClient = hc<ForumThreadAppType>(`http://localhost:4101/api/`, { headers })
export const forumAdminClient = hc<ForumAdminAppType>(`http://localhost:4101/api/`, { headers })