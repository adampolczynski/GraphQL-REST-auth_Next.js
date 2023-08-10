'use client'

import { request } from '@/api/request'
import { User } from '@/types'
import { gql, useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import { Loading } from './components/loading'
import { useAuthState } from './context/auth'

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

export default () => {
  const { isSignedIn, loading: authLoading, authData } = useAuthState()

  const [loading, setLoading] = useState<boolean>(false)

  const [error, setError] = useState<Error | unknown>()
  const [user, setUser] = useState<User>()

  const [getUser] = useLazyQuery(GET_USER)

  const callRestrictedRESTRoute = async () => {
    setLoading(true)
    try {
      const u = await (await request('http://localhost:4000/restricted')).json()
      setUser(u)
      setError(undefined)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const callRestrictedGraphQLQuery = async () => {
    setLoading(true)
    try {
      const { data } = await getUser({
        variables: { _id: authData?._id },
      })
      setUser(data)
      setError(undefined)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
          {error ? <h2 style={{ color: 'red' }}>{`${error}`}</h2> : null}
          {user ? <span style={{ padding: '2rem', fontWeight: 500, color: 'green' }}>{JSON.stringify(user).replaceAll(',', ', ')}</span> : null}
          <button disabled={authLoading || !isSignedIn} onClick={() => callRestrictedRESTRoute()} type="button" className="btn btn-primary">
            Call restricted REST route
          </button>
          <hr />
          <button disabled={authLoading || !isSignedIn} onClick={() => callRestrictedGraphQLQuery()} type="button" className="btn btn-info">
            Restricted GraphQL query
          </button>
        </div>
      )}
    </>
  )
}
