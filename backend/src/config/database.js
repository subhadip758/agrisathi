const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

let mongoMemoryServer = null;

const connectDB = async () => {
  mongoose.set('bufferCommands', true);
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
  };

  const primaryUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrisathi_v3';

  try {
    const conn = await mongoose.connect(primaryUri, options);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    const maskedUri = primaryUri.replace(/:([^@]+)@/, ':****@');
    console.warn(`⚠️ Primary MongoDB (${maskedUri}) unavailable. Initializing embedded MongoDB engine...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: { dbName: 'agrisathi_v3' }
      });
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(`✅ MongoDB Database Successfully Connected & Active: ${memoryUri}`);
      logger.info(`Embedded MongoDB Connected: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(`❌ Embedded MongoDB Server failed:`, memErr.message);
      console.warn(`⚠️ Continuing in standalone JSON file mode...`);
    }
  }

  // Graceful shutdown
  process.on('SIGINT', async () => {
    try {
      if (mongoose.connection) await mongoose.connection.close();
      if (mongoMemoryServer) await mongoMemoryServer.stop();
      console.log('MongoDB connection closed');
      process.exit(0);
    } catch (err) {
      process.exit(1);
    }
  });
};

module.exports = connectDB;