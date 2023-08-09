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
      cookieName: 'sessionId',
      secret: process.env.SESSION_SECRET || '',
    })

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

    this.app.register(authRoutes, { prefix: 'auth' })
    this.app.register(restrictedRoutes, { prefix: 'restricted' })

    // auth middleware
    this.app.addHook('onRequest', (request, reply, done) => {
      console.log('onRequest session: ', request.sessionStore)
      console.log('onRequest cookies: ', request.cookies)
      if (!request.url.includes('auth')) {
        try {
          this.app.jwt.verify(request.headers?.authorization || '')
          return done()
        } catch (err) {
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
