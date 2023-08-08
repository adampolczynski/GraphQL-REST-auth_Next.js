import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const testRoutes = (fastify: FastifyInstance, opts: {}, done: () => void) => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: 'world' }
  })
  done()
}
