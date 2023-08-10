'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useGraphQLAuth } from '../context/graphql-auth'
import { useRESTAuth } from '../context/basic-auth'
import { useAuthState } from '../context/mixed-auth'
import { Loading } from './loading'

const ROUTES = {
  Main: '/',
  Login: '/login',
  Register: '/register',
}

export const Navbar = () => {
  const { loading, authData, isSignedIn } = useAuthState()
  const { signOut: signOutREST } = useRESTAuth()
  const { signOut: signOutGraphQL } = useGraphQLAuth()

  const actualPathname = usePathname()

  const signOutUsingREST = async () => {
    signOutREST()
  }

  const signOutUsingGraphQL = () => {
    signOutGraphQL && signOutGraphQL()
  }

  if (loading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
        <Loading />
      </div>
    )

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" style={{ paddingLeft: '2rem' }}>
          GraphQL vs basic REST auth
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              marginLeft: '0.3rem',
            }}
          >
            using Next.js/MongoDB/Fastify
          </span>
          <p style={{ fontSize: 10 }}>by Adam Polczynski</p>
        </a>
        <span>{isSignedIn ? `Hey ${authData?.email}, you're on $${actualPathname}` : `Hey guest, you're on ${actualPathname}`}</span>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '30rem',
          }}
        >
          {(Object.keys(ROUTES) as (keyof typeof ROUTES)[]).map((k) => {
            if (actualPathname === ROUTES[k]) {
              return null
            }
            if (['/login', '/register'].includes(ROUTES[k]) && isSignedIn) {
              return null
            }
            return (
              <Link key={k} href={ROUTES[k]}>
                {k}
              </Link>
            )
          })}
          {isSignedIn && (
            <button onClick={signOutUsingREST} type="button" className="btn btn-primary">
              Logout (REST)
            </button>
          )}
          {isSignedIn && (
            <button onClick={signOutUsingGraphQL} type="button" className="btn btn-primary">
              Logout (GraphQL)
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
