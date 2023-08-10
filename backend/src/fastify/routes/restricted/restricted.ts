import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const restrictedRoutes = (fastify: FastifyInstance, opts: {}, done: () => void) => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: 'world' }
  })

  fastify.get('/logout', (request, reply) => {
    if (request.session.get('token')) {
      request.session.destroy()
      reply.clearCookie('sessionId')
      reply.clearCookie('token')
      return reply.status(200).send()
    } else {
      fastify.log.error('no session on logout')
      return reply.status(401).send()
    }
  })

  done()
}
