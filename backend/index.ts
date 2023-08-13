import 'dotenv/config'
import { MongoConnectionManager } from './src/db'
import { FastifyAppManager } from './src/fastify/server'
import { startApolloServer } from './src/graphql/server'

const FASTIFY_PORT = parseInt(process.env.FASTIFY_PORT || '')
const GRAPHQL_PORT = parseInt(process.env.APOLLO_PORT || '')

FastifyAppManager.createApp()
FastifyAppManager.configure()
FastifyAppManager.run(FASTIFY_PORT)
  .then(async () => {
    const { url } = await startApolloServer(GRAPHQL_PORT)
    console.log(`Apollo server started at ${url}`)
    await MongoConnectionManager.connect()
    console.log(`Connected with database`)
  })
  .catch((err: Error) => {
    console.error(err)
    process.exit(1)
  })
