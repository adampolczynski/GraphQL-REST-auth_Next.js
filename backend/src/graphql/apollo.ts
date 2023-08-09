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
    error: String
    user: User
  }
  type SignUpResponse {
    error: String
  }
  type User {
    _id: String!
    email: String!
    password: String
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    User(_id: String!): User!
  }
  type Mutation {
    signin(email: String!, password: String!): SignInResponse!
    signup(email: String!, password: String!): SignUpResponse!
    signout: String!
  }
`

const resolvers = (fastifyServer: FastifyInstance) => ({
  Query: {
    User: async (_: unknown, { _id }: { _id: string }, context: unknown) => {
      console.log('graphQL User query context: ', context)
      return await User.find({ _id }).lean()
    },
  },
  Mutation: {
    signin: async (_: unknown, { email, password }: LoginCredentials) => {
      try {
        const user = await User.findOne({ email, password }).lean()
        if (user) {
          const token = fastifyServer.jwt.sign({ _id: user._id })
          return { token, user: { _id: user._id, email } }
        } else {
          return { error: 'Invalid credentials' }
        }
      } catch (err) {
        return { error: err }
      }
    },
    signup: async (_: unknown, { email, password }: LoginCredentials) => {
      try {
        await User.create({ email, password })
      } catch (err) {
        return { error: err }
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