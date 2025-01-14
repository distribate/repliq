import {
  ForumUserAppType,
  ForumThreadAppType,
  ForumAdminAppType,
  ForumCategoriesAppType,
  ForumCommentAppType,
  ForumReactionAppType,
  ForumSharedAppType,
  ForumWebSocketAppType
} from 'forum-backend/src/types/routes-types.ts';
import { hc } from 'hono/client';

const isProduction = process.env.NODE_ENV === "production";

const production = `https://cc.fasberry.su/api/forum`
const development = `http://localhost:4101/api/forum`

const baseUrl = isProduction ? production : development

export const forumSharedClient = hc<ForumSharedAppType>(
  baseUrl,
  {
    fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          'content-type': 'application/json',
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      })
    }
  }
)

export const forumWsClient = hc<ForumWebSocketAppType>(
  baseUrl,
  {
    fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      })
    }
  }
)

export const forumReactionClient = hc<ForumReactionAppType>(
  baseUrl,
  {
    fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      })
    }
  }
)

export const forumCommentClient = (session?: string) => hc<ForumCommentAppType>(
  baseUrl,
  {
    fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
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
      })
    }
  }
)

export const forumUserClient = (session?: string) => hc<ForumUserAppType>(
  baseUrl,
  {
    fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
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
      })
    }
  }
)

export const forumThreadClient = hc<ForumThreadAppType>(
  baseUrl,
  {
    fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
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
      })
    }
  }
)

export const forumCategoriesClient = hc<ForumCategoriesAppType>(
  baseUrl,
  {
    fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          'content-type': 'application/json',
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      })
    }
  }
)

export const forumAdminClient = hc<ForumAdminAppType>(
  baseUrl,
  {
    fetch: async (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(input, {
        method: requestInit?.method ?? 'GET',
        headers: {
          'content-type': 'application/json',
          ...requestInit?.headers,
        },
        body: requestInit?.body ?? null,
        credentials: "include",
        ...requestInit,
      })
    }
  }
)