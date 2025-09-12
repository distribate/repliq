export const fetchOptions = {
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
    })
  }
}