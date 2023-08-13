import http, { type IncomingMessage, type ServerResponse } from 'http'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { json } from 'body-parser'
import cookieParser from 'cookie-parser'
import { ApolloServer } from '@apollo/server'
import { resolvers, typeDefs } from './schema'
import { expressMiddleware } from '@apollo/server/express4'

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

export interface IContext {
  res: ServerResponse
  req?: IncomingMessage
  authToken?: string
  userId?: string
}

const app = express()

const httpServer = http.createServer(app)

const server = new ApolloServer<IContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

export const startApolloServer = async (port: number) => {
  await server.start()

  app.use(
    '/',
    cookieParser(),
    cors<cors.CorsRequest>({ origin: true, credentials: true }),
    json(),
    expressMiddleware(server, {
      context: async ({
        req: {
          cookies: { token },
          body,
        },
        res,
      }) => {
        if (body.operationName === 'signin') {
          return { res }
        }

        const decodedJwt = jwt.decode(token)
        if (!decodedJwt || typeof decodedJwt !== 'object') {
          res.status(401).send('Invalid token')
          return { res }
        }

        return { res, authToken: token, userId: decodedJwt._id }
      },
    })
  )
  httpServer.listen({ port })
}
