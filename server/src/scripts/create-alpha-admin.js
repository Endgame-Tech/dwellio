// Script to create the Alpha Admin account
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

dotenv.config();

const createAlphaAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/dwellio';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check if Alpha Admin already exists
    const existingAlpha = await Admin.findOne({ adminRole: 'alpha_admin' });
    if (existingAlpha) {
      console.log('Alpha Admin already exists:', existingAlpha.email);
      process.exit(0);
    }

    // Create Alpha Admin with your email
    const alphaAdminData = {
      firstName: 'Alpha',
      lastName: 'Administrator',
      email: 'getchoma@gmail.com', // Your email as the Alpha Admin
      password: 'S0BwB$cuIqx_82Z', // Your specified password
      adminRole: 'alpha_admin',
      profile: {
        department: 'Management',
        phoneNumber: '+234-XXX-XXX-XXXX', // You can update this later
        timezone: 'Africa/Lagos',
        language: 'en',
        bio: 'Alpha Administrator with full system access'
      },
      security: {
        isActive: true,
        isVerified: true,
        twoFactorEnabled: false // You can enable this later for extra security
      },
      permissions: [], // Alpha admin doesn't need explicit permissions
      audit: {
        createdAt: new Date()
        // createdBy is not set for alpha admin as they are the root admin
      }
    };

    const alphaAdmin = new Admin(alphaAdminData);
    await alphaAdmin.save();

    console.log('✅ Alpha Admin created successfully!');
    console.log('📧 Email:', alphaAdmin.email);
    console.log('🔐 Password: S0BwB$cuIqx_82Z');
    console.log('👑 Role:', alphaAdmin.adminRole);
    console.log('🆔 ID:', alphaAdmin._id);
    console.log('');
    console.log('🚀 You can now login to the admin dashboard with these credentials.');
    console.log('⚠️  For security, consider changing the password after first login.');
    console.log('🔒 Consider enabling two-factor authentication in your profile settings.');

  } catch (error) {
    console.error('❌ Error creating Alpha Admin:', error.message);
    if (error.code === 11000) {
      console.error('This email is already registered as an admin.');
    }
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run the script
createAlphaAdmin();