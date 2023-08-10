import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useRESTAuth } from './basic-auth'
import { useGraphQLAuth } from './graphql-auth'
import { LoginCredentials, LoginResponse, User } from '@/types'

export interface IAuthContext {
  loading: boolean
  authData?: User
  setAuthData?: Dispatch<SetStateAction<User | undefined>>
  signIn: ({ email, password }: LoginCredentials) => Promise<LoginResponse>
  signOut: () => void
  isSignedIn: () => boolean
  authToken?: string
  setAuthToken?: Dispatch<SetStateAction<string | undefined>>
}

export const useAuthState = () => {
  const { loading: loadingREST, authData: authDataREST, isSignedIn: signedInREST, authToken: authTokenREST } = useRESTAuth()
  const { loading: loadingGraphQL, authData: authDataGraphQL, isSignedIn: signedInGraphQL, authToken: authTokenGraphQL } = useGraphQLAuth()

  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [authData, setAuthData] = useState<User>()
  const [authToken, setAuthToken] = useState<string>()

  useEffect(() => {
    setLoading(loadingREST || loadingGraphQL)
    setIsSignedIn(signedInREST() || signedInGraphQL())
    setAuthData(authDataREST || authDataGraphQL)
    setAuthToken(authTokenREST || authTokenGraphQL)
  }, [loadingREST, loadingGraphQL, signedInREST, signedInGraphQL, authDataREST, authDataGraphQL])

  return {
    loading,
    isSignedIn,
    authData,
    authToken,
  }
}
