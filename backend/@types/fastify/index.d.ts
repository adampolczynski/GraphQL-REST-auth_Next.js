declare module 'fastify' {
  interface FastifyInstance {
    authenticate: () => void
  }
  // interface FastifyRequest {
  //     user: IUser
  // }
  interface Session {
    _id: string
    token: string
  }
}

export default {}
