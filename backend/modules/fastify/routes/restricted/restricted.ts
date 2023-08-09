import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const restrictedRoutes = (fastify: FastifyInstance, opts: {}, done: () => void) => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    console.log(request.session)
    console.log(request.cookies)
    return { hello: 'world' }
  })

  fastify.addHook('onRequest', (request, reply, done) => {
    const { authorization: token } = request.headers
    try {
      fastify.jwt.verify(token || '')
      return done()
    } catch (err) {
      return reply.status(401).send()
    }
  })

  done()
}
