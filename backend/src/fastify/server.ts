import Fastify, { FastifyInstance } from 'fastify/fastify'
import fastiftJwt from '@fastify/jwt'

import cors from '@fastify/cors'
import { restrictedRoutes, authRoutes } from './routes'
import fastifySession from '@fastify/session'
import fastifyCookie from '@fastify/cookie'

import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

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
        // maxAge: 10000,
        secure: false,
      },
    })

    this.app.register(cors, {
      origin: true,
      credentials: true,
    })

    this.app.register(authRoutes, { prefix: 'auth' })
    this.app.register(restrictedRoutes, { prefix: 'restricted' })

    // auth middleware
    this.app.addHook('onRequest', (request, reply, done) => {
      if (!request.url.includes('auth')) {
        try {
          this.app.jwt.verify(request.cookies.token || '')
          return done()
        } catch (err) {
          this.app.log.error(err)
          return reply.status(401).send()
        }
      } else {
        return done()
      }
    })
  }

  run(port: number) {
    return this.app.listen({ host: '0.0.0.0', port })
  }
}

export default new FastifyServer()
