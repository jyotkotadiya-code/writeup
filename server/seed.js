const dotenv = require('dotenv');
const connectDB = require('./db');
const seedData = require('./seedData');

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await seedData();
    console.log('🎉 Seed database completed successfully!');
    console.log('--------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('  Admin User:    admin@writeup.com   / admin123');
    console.log('  Writer Jane:   jane@example.com    / password123');
    console.log('  Writer Arthur: arthur@example.com  / password123');
    console.log('  Reader Maya:   maya@example.com    / password123');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

runSeed();
