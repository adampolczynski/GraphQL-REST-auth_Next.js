import fastifyApollo from '@as-integrations/fastify'
import 'dotenv/config'
import { MongoConnectionManager } from './src/db'
import fastifyServer from './src/fastify/server'
import { apollo as apolloServer } from './src/graphql/apollo'

const PORT = parseInt(process.env.PORT || '')

const apollo = apolloServer(fastifyServer.app)

apollo
  .start()
  .then(async () => {
    fastifyServer.configure()
    fastifyServer.app.register(fastifyApollo(apollo))
    await fastifyServer.run(PORT)
    await MongoConnectionManager.connect()
  })
  .catch((err: Error) => {
    fastifyServer.app.log.error(err)
    process.exit(1)
  })
