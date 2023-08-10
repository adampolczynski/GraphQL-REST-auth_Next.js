import { useEffect, useState } from 'react'
import { useRESTAuth } from './basic-auth'
import { useGraphQLAuth } from './graphql-auth'
import { User } from '@/types'

export const useAuthState = () => {
  const { loading: loadingREST, authData: authDataREST, isSignedIn: signedInREST } = useRESTAuth()
  const { loading: loadingGraphQL, authData: authDataGraphQL, isSignedIn: signedInGraphQL } = useGraphQLAuth()

  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [authData, setAuthData] = useState<User>()

  useEffect(() => {
    setLoading(loadingREST || loadingGraphQL)
    setIsSignedIn(signedInREST() || signedInGraphQL())
    setAuthData(authDataREST || authDataGraphQL)
  }, [loadingREST, loadingGraphQL, signedInREST, signedInGraphQL, authDataREST, authDataGraphQL])

  return {
    loading,
    isSignedIn,
    authData,
  }
}
