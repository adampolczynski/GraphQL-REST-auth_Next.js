import { FastifyInstance } from 'fastify'
import { User } from '../../../db/models/user'
import { AuthCredentialsType } from './auth.schema'

export const authRoutes = (fastify: FastifyInstance, opts: {}, done: () => void) => {
  fastify.post<{
    Body: AuthCredentialsType
  }>('/login', async (request, reply) => {
    const { email, password } = request.body
    const user = await User.findOne({ email, password }).lean()

    if (user) {
      const token = fastify.jwt.sign({ _id: user._id })

      request.session.set('token', token)
      return reply.send({ _id: user._id, email: user.email, token })
    } else {
      return reply.status(401).send({ message: 'Invalid email or password' })
    }
  })

  fastify.post<{
    Body: AuthCredentialsType
  }>('/register', async (request, reply) => {
    const { email, password } = request.body
    const alreadyExists = await User.findOne({ email }).lean()

    if (alreadyExists) {
      return reply.status(401).send({ message: 'User already exists' })
    }
    await User.create({ email, password })
    return reply.send({})
  })

  fastify.get('/logout', (request, reply) => {
    if (request.session.authenticated) {
      request.session.destroy()
    } else {
      reply.redirect('/')
    }
  })

  done()
}
