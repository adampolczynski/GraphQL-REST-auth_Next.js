import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export const restrictedRoutes = (fastify: FastifyInstance, opts: {}, done: () => void) => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    fastify.log.info('session: ', request.session.get('token'))
    fastify.log.info('session: ', request.session.cookie)
    fastify.log.info('cookies: ', request.cookies)
    return { hello: 'world' }
  })

  fastify.get('/logout', (request, reply) => {
    console.log('session: ', request.session.get('token'))
    console.log('session: ', request.session.cookie)
    console.log('cookies: ', request.cookies)
    if (request.session.token) {
      request.session.destroy()
    } else {
      return reply.status(401).send()
    }
  })

  done()
}
