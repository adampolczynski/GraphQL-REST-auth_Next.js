import { useEffect, useState } from 'react'
import { useRESTAuth } from './basic-auth'
import { useGraphQLAuth } from './graphql-auth'
import { User } from '@/types'

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
