const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers to resolve MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if unable to override DNS servers
}

let memoryServer = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;

  if (primaryUri && !primaryUri.includes('127.0.0.1') && !primaryUri.includes('localhost')) {
    if (primaryUri.includes('<db_password>')) {
      console.log('⚠️ Notice: MONGO_URI in server/.env contains the placeholder "<db_password>".');
      console.log('👉 Please replace "<db_password>" with your actual MongoDB Atlas database password.');
      console.log('🔄 Falling back to built-in in-memory database in the meantime so your app runs seamlessly.');
    } else {
      // Atlas or remote MongoDB URI provided by user
      try {
        console.log(`Connecting to remote MongoDB Atlas: ${primaryUri.replace(/:([^@]+)@/, ':****@')}...`);
        await mongoose.connect(primaryUri);
        console.log('✅ Connected to MongoDB Atlas remote cluster successfully!');
        return;
      } catch (err) {
        console.error('❌ Failed to connect to remote MongoDB Atlas:', err.message);
        console.log('🔄 Falling back to built-in in-memory database so your app remains functional.');
      }
    }
  } else {
    // Try local MongoDB first
    try {
      console.log('Attempting connection to local MongoDB (127.0.0.1:27017)...');
      await mongoose.connect(primaryUri || 'mongodb://127.0.0.1:27017/writeup', {
        serverSelectionTimeoutMS: 2000,
      });
      console.log('✅ Connected to local MongoDB instance successfully!');
      return;
    } catch (err) {
      console.log('ℹ️ Local MongoDB instance not found (ECONNREFUSED).');
    }
  }

  // Fallback to MongoMemoryServer for instant, zero-setup local demo
  try {
    console.log('🚀 Starting built-in in-memory MongoDB server for instant zero-configuration demo...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    console.log('✅ Connected to built-in in-memory MongoDB successfully!');
    console.log('💡 Note: You can connect your MongoDB Atlas cluster anytime by setting your password in server/.env');
  } catch (err) {
    console.error('❌ Could not start in-memory MongoDB server:', err.message);
    throw err;
  }
};

module.exports = connectDB;
