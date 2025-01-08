import {
  ForumUserAppType,
  ForumThreadAppType,
  ForumAdminAppType,
  ForumCategoriesAppType,
  ForumCommentAppType,
  ForumReactionAppType,
  ForumTestAppType
} from 'forum-backend/src/types/routes-types.ts';
import { hc } from 'hono/client';

const baseUrl = `http://localhost:4101/api/`

export const forumReactionClient = hc<ForumReactionAppType>(
  baseUrl,
  {
    fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      }).then((res) => {
        return res;
      });
    }
  }
)

export const forumCommentClient = (session?: string) => hc<ForumCommentAppType>(
  baseUrl,
  {
    fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          'content-type': 'application/json',
          'Cookie': session ? `session=${session}` : ``,
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      }).then((res) => {
        return res;
      });
    }
  }
)

export const forumUserClient = (session?: string) => hc<ForumUserAppType>(
  baseUrl,
  {
    fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          'content-type': 'application/json',
          'Cookie': session ? `session=${session}` : ``,
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      }).then((res) => {
        return res;
      });
    }
  }
)

export const forumTestClient = hc<ForumTestAppType>(baseUrl)

export const forumThreadClient = hc<ForumThreadAppType>(
  baseUrl,
  {
    fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          "content-type": "multipart/form-data",
          "Content-Type": "multipart/form-data",
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      }).then((res) => {
        return res;
      });
    }
  }
)

export const forumCategoriesClient = hc<ForumCategoriesAppType>(
  baseUrl,
  {
    fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          'content-type': 'application/json',
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      }).then((res) => {
        return res;
      });
    }
  }
)

export const forumAdminClient = hc<ForumAdminAppType>(
  baseUrl,
  {
    fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          'content-type': 'application/json',
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      }).then((res) => {
        return res;
      });
    }
  }
)