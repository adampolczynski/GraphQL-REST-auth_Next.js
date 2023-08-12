'use client'

import { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { AuthFormCard, MainContainer } from '@/components'

export default () => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const [info, setInfo] = useState('')
  const [error, setError] = useState('')

  const submit = async () => {
    if (!email || !password) {
      setError('Provide credentials')
      return
    }
    if (repeatPassword !== password) {
      setError('Passwords do not match')
      return
    }
    try {
      const { message } = await (
        await fetch('http://localhost:4000/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            repeatPassword,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json()

      if (message) {
        setError(message)
      } else {
        setInfo('Account created, you will be redirected to log in')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error occured')
      console.error(error)
    }
  }

  useEffect(() => {
    setError('')
  }, [email, password, repeatPassword])

  return (
    <MainContainer>
      <h2>Register page</h2>
      {info ? (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h3 style={{ color: 'green', marginRight: '1rem' }}>{info}</h3>
          <div className="spinner-border" role="status" />
        </div>
      ) : null}
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
        <Form.Control
          tabIndex={3}
          type="password"
          placeholder="Repeat password"
          value={repeatPassword}
          onChange={({ target: { value } }) => setRepeatPassword(value)}
          style={{ marginBottom: '1rem' }}
        />
        <Button onClick={submit}>Create account</Button>
      </AuthFormCard>
    </MainContainer>
  )
}
