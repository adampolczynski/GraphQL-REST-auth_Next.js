'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useProvideAuth } from '../context/auth'
import { Loading } from './loading'

const ROUTES = {
  Main: '/',
  Login: '/login',
  Register: '/register',
}

export const Navbar = () => {
  const { loading, authData, authToken, signOut } = useProvideAuth()

  const actualPathname = usePathname()

  const signOutUsingREST = async () => {
    signOut('basic')
  }

  const signOutUsingGraphQL = () => {
    signOut('graphql')
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
        <span>{authToken ? `Hey ${authData?.email}, you're on $${actualPathname}` : `Hey guest, you're on ${actualPathname}`}</span>
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
            if (['/login', '/register'].includes(ROUTES[k]) && authToken) {
              return null
            }
            return (
              <Link key={k} href={ROUTES[k]}>
                {k}
              </Link>
            )
          })}
          {authToken && (
            <button onClick={signOutUsingREST} type="button" className="btn btn-primary">
              Logout (REST)
            </button>
          )}
          {authToken && (
            <button onClick={signOutUsingGraphQL} type="button" className="btn btn-primary">
              Logout (GraphQL)
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
