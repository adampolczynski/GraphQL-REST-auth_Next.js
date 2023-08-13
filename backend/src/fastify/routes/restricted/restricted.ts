import { FastifyInstance } from 'fastify'

export const restrictedRoutes = (fastify: FastifyInstance, opts: {}, done: () => void) => {
  fastify.get('/', async (request, reply) => {
    return reply.send(request.user)
  })

  fastify.get('/logout', (request, reply) => {
    ;(request.user as any) = undefined
    request.session.destroy()
    reply.clearCookie('sessionId')
    reply.clearCookie('token')
    return reply.status(200).send()
  })

  done()
}
