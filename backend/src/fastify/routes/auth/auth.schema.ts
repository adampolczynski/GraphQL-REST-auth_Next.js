import { Static, Type } from '@sinclair/typebox'

export const AuthCredentials = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
})

export type AuthCredentialsType = Static<typeof AuthCredentials>
