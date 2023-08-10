import Fastify, { FastifyInstance } from 'fastify/fastify'
import fastiftJwt from '@fastify/jwt'

import cors from '@fastify/cors'
import { restrictedRoutes, authRoutes } from './routes'
import fastifySession from '@fastify/session'
import fastifyCookie from '@fastify/cookie'

import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { User } from '../db/models/user'

class FastifyServer {
  public app: FastifyInstance

  constructor() {
    this.app = Fastify({
      logger: {
        level: 'info',
      },
    }).withTypeProvider<TypeBoxTypeProvider>()
  }

  configure() {
    this.app.register(fastiftJwt, {
      secret: process.env.AUTH_SECRET || '',
    })
    this.app.register(fastifyCookie)
    this.app.register(fastifySession, {
      secret: process.env.SESSION_SECRET || '',
      cookie: {
        secure: false,
        sameSite: 'strict',
      },
    })

    this.app.register(cors, {
      origin: true,
      credentials: true,
    })

    this.app.register(authRoutes, { prefix: 'auth' })
    this.app.register(restrictedRoutes, { prefix: 'restricted' })

    // auth middleware
    this.app.addHook('onRequest', async (request, reply) => {
      if (!request.url.includes('auth')) {
        try {
          const decodedJwt = this.app.jwt.decode<{ _id: string }>(request.cookies.token || '')
          const user = await User.findOne({ _id: decodedJwt?._id }).lean()
          if (user) {
            request.user = JSON.parse(JSON.stringify(user))
          } else {
            return reply.status(400).send({ message: 'Auth middleware problem' })
          }
        } catch (err) {
          this.app.log.error(err)
          return reply.status(401).send()
        }
      } else {
      }
    })
  }

  run(port: number) {
    return this.app.listen({ host: '0.0.0.0', port })
  }
}

export default new FastifyServer()
