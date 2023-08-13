import { FastifyReply, FastifyRequest } from 'fastify'
import { User } from '../../db/models/user'

export const authHook = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!request.url.includes('auth')) {
    try {
      const decodedJwt = request.server.jwt.decode<{ _id: string }>(request.cookies.token || '')
      const user = await User.findOne({ _id: decodedJwt?._id }).lean()
      if (user) {
        request.user = JSON.parse(JSON.stringify(user))
      } else {
        return reply.status(400).send({ message: 'Auth middleware problem' })
      }
    } catch (err) {
      console.error(err)
      const e = err as Error
      return reply.status(401).send({ message: e.message })
    }
  }
}
