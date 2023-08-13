import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { LoginCredentials, LoginResponse, User } from '@/types'
import localForage from 'localforage'
import { request } from '@/api/request'
import { ApolloClient, ApolloProvider, gql, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'

type AuthMethod = 'basic' | 'graphql'

export interface IAuthContext {
  loading?: boolean
  authData?: User
  setAuthData?: Dispatch<SetStateAction<User | undefined>>
  signIn: ({ email, password }: LoginCredentials, method: AuthMethod) => Promise<LoginResponse>
  signOut: (method: AuthMethod) => void
  authToken?: string
  setAuthToken?: Dispatch<SetStateAction<string | undefined>>
  createApolloClient?: () => ApolloClient<NormalizedCacheObject>
  apolloClient?: ApolloClient<NormalizedCacheObject>
}

const AuthContext = createContext<IAuthContext>({
  loading: true,
  signIn: async () => ({ _id: 'mock', email: 'mock', token: 'mock' }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthState()

  return (
    <AuthContext.Provider value={auth}>
      <ApolloProvider client={auth.createApolloClient()}>{children}</ApolloProvider>
    </AuthContext.Provider>
  )
}

export const useProvideAuth = () => {
  return useContext(AuthContext)
}

const useAuthState = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [authData, setAuthData] = useState<User>()
  const [authToken, setAuthToken] = useState<string>()

  const createApolloClient = () => {
    const link = new HttpLink({
      uri: 'http://localhost:4001/',
      credentials: 'include',
    })

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    })
  }

  const client = createApolloClient()

  const signIn = async ({ email, password }: LoginCredentials, method: AuthMethod) => {
    try {
      let _id, token, message
      switch (method) {
        case 'basic':
          ;({ _id, token, message } = await (
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
          ).json())
          console.log('basic rest login res: ', _id, token, message)
          break
        case 'graphql':
          const LoginMutation = gql`
            mutation signin($email: String!, $password: String!) {
              signin(email: $email, password: $password) {
                token
                user {
                  _id
                }
              }
            }
          `

          const { data } = await client.mutate({
            mutation: LoginMutation,
            variables: { email, password },
          })

          console.log(data)

          _id = data.signin.user?._id
          token = data?.signin?.token
          console.log('graphql  login res: ', _id, token)
          break
        default:
          console.warn('Wrong method given')
      }

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

  const signOut = async (method: AuthMethod) => {
    switch (method) {
      case 'basic':
        try {
          await request('http://localhost:4000/restricted/logout')
        } catch (err) {
          console.error(err)
        }
        break
      case 'graphql':
        const SIGN_OUT_MUTATION = gql`
          mutation signout($p: String) {
            signout(p: $p) {
              message
            }
          }
        `
        try {
          await client.mutate({
            mutation: SIGN_OUT_MUTATION,
            variables: { p: 'test' },
          })
        } catch (err) {
          console.error(err)
        }

        break
      default:
        console.warn('Wrong method given')
        break
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
    signIn,
    signOut,
    createApolloClient,
    apolloClient: client,
  }
}
