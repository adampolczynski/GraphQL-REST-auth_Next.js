import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { resolvers, typeDefs } from './schema'

interface MyContext {
  token?: String
}

const server = new ApolloServer<MyContext>({ typeDefs, resolvers })

export const startApolloServer = (port: number) =>
  startStandaloneServer(server, {
    context: async ({ req }) => ({ token: req.headers.token }),

    listen: { port },
  })
