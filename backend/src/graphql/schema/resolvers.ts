import { FastifyInstance } from 'fastify'
import { User } from '../../db/models/user'

type LoginCredentials = {
  email: string
  password: string
}

export const resolvers = {
  Query: {
    User: async (_: unknown, { _id }: { _id: string }, context: unknown) => {
      console.log('graphQL User query context: ', _, _id, context)
      return await User.findOne({ _id }).lean()
    },
  },
  Mutation: {
    signin: async (_: unknown, { email, password }: LoginCredentials) => {
      try {
        const user = await User.findOne({ email })

        if (!user) {
          return { message: 'Email not found' }
        }

        if (!(await user.comparePassword(password))) {
          return { message: 'Invalid password' }
        }
        const token = '' // fastifyServer.jwt.sign({ _id: user._id })
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
    signout: async (_: any, a: any, b: any) => {
      console.log('graphQl singout', _, a, b)

      return 'logged out'
    },
  },
}
