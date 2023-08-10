export const request = (url: string, opts?: RequestInit, authToken?: string) => {
  return fetch(url, {
    ...opts,
    credentials: 'include',
    headers: {
      ...opts?.headers,
      ...{
        // cookie: `token=${authToken};path=/;expires=Session;SameSite=Strict`,
      },
    },
  })
}
