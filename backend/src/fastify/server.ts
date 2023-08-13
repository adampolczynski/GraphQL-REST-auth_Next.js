import Fastify, { FastifyInstance } from 'fastify/fastify'
import fastiftJwt from '@fastify/jwt'

import cors from '@fastify/cors'
import { restrictedRoutes, authRoutes } from './routes'
import fastifySession from '@fastify/session'
import fastifyCookie from '@fastify/cookie'

import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { authHook } from './hooks/auth'

function StaticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor
  }
}

interface IFastifyAppManager {
  createApp(): void
  getApp: () => FastifyInstance
  configure: () => void
  run: (port: number) => Promise<string>
}

@StaticImplements<IFastifyAppManager>()
export class FastifyAppManager {
  private static app: FastifyInstance

  static createApp() {
    this.app = Fastify({
      logger: {
        level: 'info',
      },
    }).withTypeProvider<TypeBoxTypeProvider>()
  }

  static getApp() {
    return this.app
  }

  static configure() {
    this.app.register(fastiftJwt, {
      secret: process.env.JWT_SECRET || '',
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
    this.app.addHook('onRequest', authHook)
  }

  static run(port: number) {
    return this.app.listen({ host: '0.0.0.0', port })
  }
}
