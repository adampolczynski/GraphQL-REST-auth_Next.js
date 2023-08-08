import Fastify, { FastifyInstance } from 'fastify/fastify'
import fastiftJwt from '@fastify/jwt'

import cors from '@fastify/cors'
import { testRoutes, authRoutes } from './routes'
import fastifySession from '@fastify/session'
import fastifyCookie from '@fastify/cookie'
class FastifyServer {
  public app: FastifyInstance

  constructor() {
    this.app = Fastify({
      logger: {
        level: 'info',
      },
    })
  }

  configure() {
    this.app.register(fastiftJwt, {
      secret: process.env.AUTH_SECRET || '',
    })
    this.app.register(fastifyCookie)
    this.app.register(fastifySession, { secret: process.env.SESSION_SECRET || '' })

    this.app.register(cors, {
      origin: (origin, cb) => {
        if (!origin) {
          cb(new Error('Not allowed - "origin" lacking'), false)
          return
        }
        const hostname = new URL(origin).hostname
        if (hostname === 'localhost') {
          cb(null, true)
          return
        }
        cb(new Error('Not allowed'), false)
      },
    })

    this.app.register(testRoutes)
    this.app.register(authRoutes, { prefix: 'auth' })

    this.app.addHook('onRequest', (request, reply, done) => {
      if (request.url.includes('auth')) {
        done()
      }

      const { authorization: token } = request.headers as { authorization: string } // @TODO typebox?
      try {
        this.app.jwt.verify(token)
        return done()
      } catch (err) {
        return reply.status(401).send()
      }
    })
  }

  run(port: number) {
    return this.app.listen({ host: '0.0.0.0', port })
  }
}

export default new FastifyServer()
