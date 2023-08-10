import { ApolloServer } from '@apollo/server'
import { fastifyApolloDrainPlugin } from '@as-integrations/fastify'
import { FastifyInstance } from 'fastify'
import { User } from '../db/models/user'

type LoginCredentials = {
  email: string
  password: string
}

const typeDefs = `#graphql
  type SignInResponse {
    token: String
    message: String
    user: User
  }
  type SignUpResponse {
    message: String
  }
  type SignOutResponse {
    message: String
  }
  type User {
    _id: String!
    email: String!
    password: String!
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    User(_id: String!): User!
  }
  type Mutation {
    signin(email: String!, password: String!): SignInResponse!
    signup(email: String!, password: String!): SignUpResponse!
    signout(p: String): SignOutResponse!
  }
`

const resolvers = (fastifyServer: FastifyInstance) => ({
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
        const token = fastifyServer.jwt.sign({ _id: user._id })
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
})

export const apollo = (fastifyServer: FastifyInstance) => {
  return new ApolloServer({
    typeDefs,
    resolvers: resolvers(fastifyServer),
    plugins: [fastifyApolloDrainPlugin(fastifyServer)],
  })
}
