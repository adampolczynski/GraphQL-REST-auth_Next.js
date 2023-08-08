'use client'

import { gql, useQuery, useLazyQuery } from '@apollo/client'

export default function Home() {
  const GET_TASKS = gql`
    query Tasks {
      _id
      title
    }
  `
  const [getTasks, { loading, error, data }] = useLazyQuery(GET_TASKS)

  const callRestrictedRESTRoute = async () => {
    return await fetch('http://localhost:4000')
  }

  const callRestrictedGraphQLQuery = async () => {
    console.log('query', await getTasks())
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
