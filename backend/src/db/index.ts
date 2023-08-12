import mongoose from 'mongoose'

export class MongoConnectionManager {
  private static mongooseClient: typeof mongoose

  static async connect() {
    if (this.mongooseClient && this.mongooseClient.connection.readyState === 1) {
      console.warn('Warn: DB connection already valid')
      return
    }
    this.mongooseClient = await mongoose.connect(
      `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:27017/${process.env.MONGO_DB_NAME}`
    )
  }
  static getMongooseClient() {
    return this.mongooseClient
  }
}
