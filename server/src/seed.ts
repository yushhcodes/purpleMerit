import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import User from './models/User.js';

const seed = async () => {
  await connectDB();
  await User.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
  });

  await User.create({
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'manager123',
    role: 'manager',
    status: 'active',
    createdBy: admin._id,
    updatedBy: admin._id,
  });

  await User.create({
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    status: 'active',
    createdBy: admin._id,
    updatedBy: admin._id,
  });

  console.log('Seeded successfully');
  console.log('admin@example.com / admin123');
  console.log('manager@example.com / manager123');
  console.log('user@example.com / user123');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });