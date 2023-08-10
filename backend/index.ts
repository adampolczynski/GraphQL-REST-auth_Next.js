import fastifyApollo from '@as-integrations/fastify'
import mongoose from 'mongoose'
import 'dotenv/config'
import fastifyServer from './src/fastify/server'
import { apollo as apolloServer } from './src/graphql/apollo'

const PORT = parseInt(process.env.PORT || '')

const apollo = apolloServer(fastifyServer.app)

apollo
  .start()
  .then(async () => {
    fastifyServer.configure()
    fastifyServer.app.register(fastifyApollo(apollo), { prefix: 'auth' })
    await fastifyServer.run(PORT)
    await mongoose.connect('mongodb://tester:test@db:27017/test')
  })
  .catch((err: Error) => {
    fastifyServer.app.log.error(err)
    process.exit(1)
  })
