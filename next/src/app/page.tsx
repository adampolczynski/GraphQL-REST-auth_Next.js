'use client'

import { gql, useQuery, useLazyQuery } from '@apollo/client'

export default function Home() {
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
  const [getUser, { loading, error, data }] = useLazyQuery(GET_USER)

  const callRestrictedRESTRoute = async () => {
    return await fetch('http://localhost:4000/restricted')
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
      <button onClick={() => callRestrictedRESTRoute()} type="button" className="btn btn-primary">
        Call restricted REST route
      </button>
      <hr />
      <button onClick={() => callRestrictedGraphQLQuery()} type="button" className="btn btn-info">
        Restricted GraphQL query
      </button>
    </div>
  )
}
