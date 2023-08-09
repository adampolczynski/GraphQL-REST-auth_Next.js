declare module 'fastify' {
  interface FastifyInstance {
    authenticate: () => void
  }
  interface FastifyRequest {}
  interface Session {
    authenticated: boolean
    _id: string
    token: string
  }
}

export default {}
