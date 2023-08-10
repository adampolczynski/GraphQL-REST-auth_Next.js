import { UserType } from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: () => void
  }
  interface FastifyRequest {}
  interface Session {
    authenticated: boolean
    token: string
    user: UserType
  }
}

export default {}
