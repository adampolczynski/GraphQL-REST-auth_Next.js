import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const restrictedRoutes = (fastify: FastifyInstance, opts: {}, done: () => void) => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    console.log('session: ', request.session)
    console.log('cookies: ', request.cookies)
    return { hello: 'world' }
  })

  fastify.get('/logout', (request, reply) => {
    console.log('logout', request)
    if (request.session.authenticated) {
      request.session.destroy()
    } else {
      reply.send()
    }
  })

  done()
}
