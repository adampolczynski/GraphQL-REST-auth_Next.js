'use client'
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { AuthFormCard, MainContainer } from '@/app/components'
import { useGraphQLAuth } from '@/app/context/graphql-auth'
import { useRESTAuth } from '@/app/context/basic-auth'

export default () => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  const { signIn: graphQLSignIn } = useGraphQLAuth()
  const { signIn: RESTSignIn } = useRESTAuth()

  const validateInputs = () => {
    if (!email || !password) {
      throw new Error('Provide credentials')
    }
  }

  const loginUsingGraphQL = async () => {
    try {
      validateInputs()
      await graphQLSignIn({ email, password })
      router.push('/')
    } catch (error) {
      const e = error as Error
      setError(e.message)
    }
  }

  const loginUsingREST = async () => {
    try {
      validateInputs()
      await RESTSignIn({ email, password })
      router.push('/')
    } catch (error) {
      const e = error as Error
      setError(e.message)
    }
  }

  useEffect(() => {
    setError('')
  }, [email, password])

  return (
    <MainContainer>
      {error ? <h3 style={{ color: 'orange' }}>{error}</h3> : null}
      <AuthFormCard>
        <Form.Control
          tabIndex={1}
          type="email"
          placeholder="Email"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          style={{ marginBottom: '1rem' }}
        />
        <Form.Control
          tabIndex={2}
          type="password"
          placeholder="Password"
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
          style={{ marginBottom: '1rem' }}
        />
        <Button tabIndex={3} style={{ marginBottom: '1rem' }} onClick={loginUsingREST}>
          Login using REST
        </Button>
        <Button tabIndex={4} onClick={loginUsingGraphQL}>
          Login using GraphQL
        </Button>
      </AuthFormCard>
    </MainContainer>
  )
}
