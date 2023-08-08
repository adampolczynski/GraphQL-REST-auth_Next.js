'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGraphQLAuth } from '../context/apollo-auth'
import { useRESTAuth } from '../context/auth'
import { User } from '../types'

const ROUTES = {
  Main: '/',
  Login: '/login',
  Register: '/register',
  'The board': '/dashboard',
}

export const Navbar = () => {
  const { authData: authDataREST, signOut: signOutREST, isSignedIn: signedInREST } = useRESTAuth()
  const { authData: authDataGraphQL, signOut: signOutGraphQL, isSignedIn: signedInGraphQL } = useGraphQLAuth()

  const [isSignedIn, setIsSignedIn] = useState<boolean>()
  const [authData, setAuthData] = useState<User>()

  const actualPathname = usePathname()

  const signOutUsingREST = async () => {
    signOutREST()
  }

  const signOutUsingGraphQL = () => {
    signOutGraphQL && signOutGraphQL()
  }

  useEffect(() => {
    console.log(signedInREST(), signedInGraphQL(), authDataREST, authDataGraphQL)
    setIsSignedIn(signedInREST() || signedInGraphQL())
    setAuthData(authDataREST || authDataGraphQL)
  }, [signedInREST, signedInGraphQL, authDataREST, authDataGraphQL])

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" style={{ paddingLeft: '2rem' }}>
          Canban board
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              marginLeft: '0.3rem',
            }}
          >
            using Next/GraphQL/MongoDB/Fastify
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
