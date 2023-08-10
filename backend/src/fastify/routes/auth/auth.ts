import { FastifyInstance } from 'fastify'
import { User } from '../../../db/models/user'
import { AuthCredentialsType } from './auth.schema'

export const authRoutes = (fastify: FastifyInstance, opts: {}, done: () => void) => {
  fastify.post<{
    Body: AuthCredentialsType
  }>('/login', async (request, reply) => {
    const { email, password } = request.body
    const user = await User.findOne({ email })

    if (!user) {
      return reply.status(401).send({ message: 'Email not found' })
    }

    if (!(await user.comparePassword(password))) {
      return reply.status(401).send({ message: 'Invalid password' })
    }

    const token = fastify.jwt.sign({ _id: user._id })

    request.session.set('token', token)
    request.session.set('user', user)

    reply.setCookie('token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
    })
    return reply.send({ _id: user._id, email: user.email, token })
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

  done()
}
