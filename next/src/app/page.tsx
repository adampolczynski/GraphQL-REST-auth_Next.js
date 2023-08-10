'use client'

import { request } from '@/api/request'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import { useAuthState } from './context/mixed-auth'

const GET_USER = gql`
  query User($_id: String!) {
    User(_id: $_id) {
      _id
      email
      createdAt
      updatedAt
    }
  }
`

export default function Home() {
  const { isSignedIn, loading: authLoading, authToken } = useAuthState()

  const [getUser, { loading, error, data }] = useLazyQuery(GET_USER)

  const callRestrictedRESTRoute = async () => {
    return await request('http://localhost:4000/restricted', undefined, authToken)
  }

  const callRestrictedGraphQLQuery = async () => {
    console.log(
      'query',
      await getUser({
        variables: { _id: 'asd' },
      })
    )
  }

  return (
    <div
      style={{
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        width: '30rem',
      }}
    >
      <button disabled={authLoading || !isSignedIn} onClick={() => callRestrictedRESTRoute()} type="button" className="btn btn-primary">
        Call restricted REST route
      </button>
      <hr />
      <button disabled={authLoading || !isSignedIn} onClick={() => callRestrictedGraphQLQuery()} type="button" className="btn btn-info">
        Restricted GraphQL query
      </button>
    </div>
  )
}
