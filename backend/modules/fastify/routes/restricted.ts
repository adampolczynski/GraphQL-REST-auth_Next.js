import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const testRoutes = (fastify: FastifyInstance, opts: {}, done: () => void) => {
  fastify.get(
    '/',
    {
      onRequest: [
        async (req, reply) => {
          fastify.log.info('On request authenticate')
          try {
            await req.jwtVerify()
          } catch (err) {
            reply.send(err)
          }
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return { hello: 'world' }
    }
  )
  done()
}
