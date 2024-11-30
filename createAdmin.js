const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path to your User model
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');

  async function createAdmin() {
    const existingAdmin = await User.findOne({ username: 'sanil@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
  
    const hashedPassword = await bcrypt.hash('sanil123', 10);
    const admin = new User({ username: 'sanil@gmail.com', password: hashedPassword });
  
    try {
      await admin.save();
      console.log('Admin user created successfully');
    } catch (err) {
      console.error('Error creating admin:', err.message);
    } finally {
      mongoose.connection.close();
    }
  }

  createAdmin();
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});
