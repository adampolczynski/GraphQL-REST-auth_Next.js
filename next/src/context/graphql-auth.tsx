import React, { useState, useContext, createContext, ReactNode, useEffect } from 'react'
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, gql, NormalizedCacheObject } from '@apollo/client'
import { LoginCredentials, User } from '@/types'
import localForage from 'localforage'
import { IAuthContext } from './auth'

const authContext = createContext<IAuthContext & { createApolloClient?: () => ApolloClient<NormalizedCacheObject> }>({
  loading: true,
  isSignedIn: () => false,
  signIn: async () => ({ _id: 'graphqlmock', email: 'graphqlmock', token: 'graphqlmock' }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useProvideAuth()

  return (
    <authContext.Provider value={auth}>
      <ApolloProvider client={auth.createApolloClient()}>{children}</ApolloProvider>
    </authContext.Provider>
  )
}

export const useGraphQLAuth = () => {
  return useContext(authContext)
}

const useProvideAuth = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [authData, setAuthData] = useState<User>()
  const [authToken, setAuthToken] = useState<string>()

  const createApolloClient = () => {
    const link = new HttpLink({
      uri: 'http://localhost:4001/',
      credentials: 'same-origin',
      // headers: {
      //   'Content-Type': 'application/json',
      //   cookie: `token=${authToken};path=/;SameSite=strict`,
      // },
    })

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    })
  }

  const client = createApolloClient()

  const isSignedIn = () => {
    if (authToken) {
      return true
    } else {
      return false
    }
  }

  const signIn = async ({ email, password }: LoginCredentials) => {
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

    const token = data?.signin?.token

    if (token) {
      const authData = { _id: data.signin.user?._id, email }
      setAuthData(authData)
      setAuthToken(token)
      await localForage.setItem('authData', authData)
      await localForage.setItem('token', token)
    }

    return { ...authData, token }
  }

  const signOut = async () => {
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
    createApolloClient,
  }
}
