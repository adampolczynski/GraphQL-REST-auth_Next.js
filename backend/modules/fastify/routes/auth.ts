import { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify'
import { User } from '../../db/models/user'

export const authRoutes = (fastify: FastifyInstance, opts: {}, done: () => void) => {
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string } // @TODO typebox?
    const user = await User.findOne({ email, password }).lean()

    if (user) {
      const token = fastify.jwt.sign({ _id: user._id })

      return reply.send({ _id: user._id, email: user.email, token })
    } else {
      return reply.status(401).send({ message: 'Invalid email or password' })
    }
  })
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string } // @TODO typebox?
    const alreadyExists = await User.findOne({ email }).lean()
    if (alreadyExists) {
      return reply.status(401).send({ message: 'User already exists' }) // @redirect?
    }
    await User.create({ email, password })
    return reply.send({})
  })
  // fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
  //   const { authorization: token } = request.headers as { authorization: string } // @TODO typebox?
  //   const verified = fastify.jwt.verify(token)
  //   if (verified) {
  //     return reply.send()
  //   }
  //   return reply.send()
  // })
  done()
}
