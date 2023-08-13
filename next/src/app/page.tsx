'use client'

import { request } from '@/api/request'
import { User } from '@/types'
import { gql } from '@apollo/client'
import { useState } from 'react'
import { Loading } from '../components/loading'
import { useProvideAuth } from '../context/auth'

const GET_PROFILE_QUERY = gql`
  query Profile {
    Profile {
      _id
      email
      createdAt
      updatedAt
    }
  }
`

export default () => {
  const { authToken, loading: authLoading, authData, apolloClient } = useProvideAuth()

  const [loading, setLoading] = useState<boolean>(false)

  const [error, setError] = useState<Error | unknown>()
  const [user, setUser] = useState<User>()

  const callRestrictedRESTRoute = async () => {
    setLoading(true)
    try {
      const u = await (await request('http://localhost:4000/restricted')).json()
      if (u.message) {
        setError(u.message)
      } else {
        setUser(u)
        setError(undefined)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const callRestrictedGraphQLQuery = async () => {
    setLoading(true)
    try {
      if (!apolloClient) {
        console.error('refactor apollo client')
        return
      }
      const { data } = await apolloClient.query({
        query: GET_PROFILE_QUERY,
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
          {error ? <h2 style={{ margin: '2ren', color: 'red' }}>{`${error}`}</h2> : null}
          {user ? <span style={{ margin: '2rem', fontWeight: 500, color: 'green' }}>{JSON.stringify(user).replaceAll(',', ', ')}</span> : null}
          <button disabled={authLoading} onClick={() => callRestrictedRESTRoute()} type="button" className="btn btn-primary">
            Call restricted REST route
          </button>
          <hr />
          <button disabled={authLoading} onClick={() => callRestrictedGraphQLQuery()} type="button" className="btn btn-info">
            Restricted GraphQL query
          </button>
        </div>
      )}
    </>
  )
}
