import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { LoginCredentials, User } from '@/types'
import localForage from 'localforage'
import { request } from '@/api/request'
import { IAuthContext } from './auth'

const AuthContext = createContext<IAuthContext>({
  loading: true,
  signIn: async () => ({ _id: 'mock', token: 'mock', email: 'mock' }),
  signOut: () => {},
  isSignedIn: () => false,
})

export const useRESTAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useProvideAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

const useProvideAuth = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [authData, setAuthData] = useState<User>()
  const [authToken, setAuthToken] = useState<string>()

  const isSignedIn = () => {
    if (authToken) {
      return true
    } else {
      return false
    }
  }

  const signIn = async ({ email, password }: LoginCredentials) => {
    try {
      const { _id, token, message } = await (
        await request('http://localhost:4000/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json()

      if (message) {
        return Promise.reject({ message })
      } else {
        setAuthData({ _id, email })
        setAuthToken(token)
        await localForage.setItem('authData', { _id, email })
        await localForage.setItem('token', token)
        return Promise.resolve({ _id, email, token })
      }
    } catch (error) {
      console.warn(`error: ${error}`, error)
      const e = error as Error
      return Promise.reject({ message: e.message })
    }
  }

  const signOut = async () => {
    try {
      await request('http://localhost:4000/restricted/logout')
    } catch (err) {
      console.error(err)
    }
    setAuthData(undefined)
    setAuthToken(undefined)
    await localForage.removeItem('authData')
    await localForage.removeItem('token')
  }

  useEffect(() => {
    Promise.all([localForage.getItem<string | undefined>('token'), localForage.getItem<User | undefined>('authData')]).then(([storedToken, storedAuthData]) => {
      setAuthToken(storedToken || undefined)
      setAuthData(storedAuthData || undefined)
      setLoading(false)
    })
  }, [])

  return {
    loading,
    authData,
    setAuthData,
    authToken,
    setAuthToken,
    isSignedIn,
    signIn,
    signOut,
  }
}
