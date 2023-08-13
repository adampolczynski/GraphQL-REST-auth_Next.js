import jwt from 'jsonwebtoken'
import { User } from '../../db/models/user'
import { IContext } from '../server'

type LoginCredentials = {
  email: string
  password: string
}

export const resolvers = {
  Query: {
    User: async (_: unknown, { _id }: { _id: string }, { authToken }: IContext) => {
      console.log('graphQL User query token: ', authToken)
      return await User.findOne({ _id }).lean()
    },
  },
  Mutation: {
    signin: async (_: unknown, { email, password }: LoginCredentials, { res }: IContext) => {
      try {
        const user = await User.findOne({ email })

        if (!user) {
          return { message: 'Email not found' }
        }

        if (!(await user.comparePassword(password))) {
          return { message: 'Invalid password' }
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || '')

        res.setHeader('Set-Cookie', `token=${token}; SameSite=Strict`)

        return { token, user: { _id: user._id, email } }
      } catch (err) {
        return { message: err }
      }
    },
    signup: async (_: unknown, { email, password }: LoginCredentials) => {
      try {
        await User.create({ email, password })
      } catch (err) {
        return { message: err }
      }
    },
    signout: async (_: any, a: any, { res }: IContext) => {
      res.setHeader('Set-Cookie', 'token=rubbish;expires=Thu, Jan 01 1970 00:00:00 UTC;')
      res.setHeader('Set-Cookie', 'sessionId=rubbish;expires=Thu, Jan 01 1970 00:00:00 UTC;')
      return 'logged out'
    },
  },
}
