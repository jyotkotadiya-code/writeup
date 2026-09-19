const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/writeup';

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@writeup.com';
    const adminPasswordRaw = process.env.ADMIN_PASSWORD || 'admin123';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log(`Admin user already exists: ${adminEmail}`);
      process.exit(0);
    }

    admin = new User({
      name: 'System Admin',
      username: 'admin',
      email: adminEmail,
      password: adminPasswordRaw,
      role: 'admin',
    });

    await admin.save();
    console.log(`✅ Admin account created successfully!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPasswordRaw}`);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
