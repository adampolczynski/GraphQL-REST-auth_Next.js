import { Static, Type } from '@sinclair/typebox'

export const User = Type.Object({
  _id: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String(),
  createdAt: Type.Date(),
  updatedAt: Type.Date(),
})

export type UserType = Static<typeof User>
