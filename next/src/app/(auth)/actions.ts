'use server'

// just playing, server actions are still experimental
import { cookies } from 'next/headers'

export const getAuthToken = async () => {
  return (await cookies().get('token'))?.value
}

export const setAuthToken = (token: string) => {
  cookies().set('token', token)
}

export const authCheck = async () => {
  const { value: token } = cookies().get('token') || {}

  if (token) {
    const json = await (
      await fetch('http://backend:4000/auth/check', {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
          origin: 'http://localhost:3000',
        },
      })
    ).json()

    return Promise.resolve({ token, email: json.email, _id: json._id })
  } else {
    return Promise.reject()
  }
}

export const authLogout = async () => {
  try {
    const { value: token } = cookies().get('token') || {}

    await fetch('http://backend:4000/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `${token}`,
        origin: 'http://localhost:3000',
      },
    })

    cookies().set('token', '')
  } catch (err) {
    console.error(err)
  }
}
