import React, { useState, useContext, createContext, ReactNode, Dispatch, SetStateAction, useEffect } from 'react'
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, gql, NormalizedCacheObject } from '@apollo/client'
import { LoginCredentials, User } from '@/types'
import localForage from 'localforage'

const authContext = createContext<{
  authData?: User
  setAuthData?: Dispatch<SetStateAction<User | undefined>>
  signIn: ({ email, password }: LoginCredentials) => Promise<void>
  signOut?: () => void
  isSignedIn: () => boolean
  createApolloClient?: () => ApolloClient<NormalizedCacheObject>
  authToken?: string
  setAuthToken?: Dispatch<SetStateAction<string | undefined>>
}>({
  isSignedIn: () => false,
  signIn: async () => {},
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
  const [authData, setAuthData] = useState<User>()
  const [authToken, setAuthToken] = useState<string>()

  const isSignedIn = () => {
    if (authToken) {
      return true
    } else {
      return false
    }
  }

  const getAuthHeaders = () => {
    if (!authToken) return

    return {
      authorization: `Bearer ${authToken}`,
    }
  }

  const createApolloClient = () => {
    const link = new HttpLink({
      uri: 'http://localhost:4000/graphql',
      headers: getAuthHeaders(),
    })

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    })
  }

  const signIn = async ({ email, password }: LoginCredentials) => {
    const client = createApolloClient()
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

    const result = await client.mutate({
      mutation: LoginMutation,
      variables: { email, password },
    })

    console.log(result)

    if (result?.data?.signin?.token) {
      const authData = { _id: result.data.signin.user?._id, email }
      setAuthData(authData)
      setAuthToken(result.data.signin.token)
      await localForage.setItem('authData', authData)
      await localForage.setItem('token', result.data.signin.token)
    }
  }

  const signOut = async () => {
    setAuthData(undefined)
    setAuthToken(undefined)
    await localForage.removeItem('authData')
    await localForage.removeItem('token')
  }

  useEffect(() => {
    localForage.getItem<string | undefined>('token').then((storedToken) => {
      setAuthToken(storedToken || undefined)
      localForage.getItem<User | undefined>('authData').then((storedAuthData) => {
        setAuthData(storedAuthData || undefined)
      })
    })
  }, [])

  return {
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
