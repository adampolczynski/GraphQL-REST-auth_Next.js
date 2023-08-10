import { UserType } from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: () => void
  }
  interface FastifyRequest {
    user?: UserType
  }
  interface Session {
    user: UserType
    token: string
  }
}

export default {}
