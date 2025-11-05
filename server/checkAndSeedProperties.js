// Quick script to check and seed properties
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './src/models/Property.js';
import User from './src/models/User.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/ubani';

async function checkAndSeed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing properties
    const propertyCount = await Property.countDocuments();
    console.log(`\n📊 Current properties in database: ${propertyCount}`);

    if (propertyCount > 0) {
      const properties = await Property.find().limit(5);
      console.log('\n📋 Sample properties:');
      properties.forEach((prop, idx) => {
        console.log(`\n${idx + 1}. ${prop.title}`);
        console.log(`   ID: ${prop._id}`);
        console.log(`   Status: ${prop.status}`);
        console.log(`   Approval Status: ${prop.approvalStatus || 'NOT SET (will default to pending)'}`);
        console.log(`   Active: ${prop.isActive}`);
        console.log(`   Bedrooms: ${prop.bedrooms || 'NOT SET'}`);
        console.log(`   Bathrooms: ${prop.bathrooms || 'NOT SET'}`);
      });
    }

    // Check for landlord users
    const landlords = await User.find({ role: 'landlord' }).limit(1);
    let landlordId;

    if (landlords.length === 0) {
      console.log('\n⚠️  No landlord users found. Creating a test landlord...');
      const testLandlord = await User.create({
        email: 'landlord@test.com',
        password: '$2a$10$X7vqJ0Z1KLZ6Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', // hashed "password123"
        firstName: 'Test',
        lastName: 'Landlord',
        phoneNumber: '08012345678',
        role: 'landlord',
        isVerified: true
      });
      landlordId = testLandlord._id;
      console.log(`✅ Created test landlord: ${testLandlord.email}`);
    } else {
      landlordId = landlords[0]._id;
      console.log(`\n✅ Found landlord: ${landlords[0].email}`);
    }

    // Create test properties if none exist
    if (propertyCount === 0) {
      console.log('\n🏗️  Creating test properties...');

      const testProperties = [
        {
          title: 'Luxury 3-Bedroom Flat in Lekki',
          type: 'flat',
          landlordId: landlordId,
          landlordContact: {
            phone: '08012345678',
            email: 'landlord@test.com',
            name: 'Test Landlord'
          },
          location: {
            state: 'Lagos',
            city: 'Lekki',
            lga: 'Eti-Osa',
            address: '15 Admiralty Way, Lekki Phase 1'
          },
          media: [
            { url: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=1000&q=80' },
            { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80' }
          ],
          amenities: ['Swimming Pool', 'Gym', 'Security', '24/7 Power', 'Parking'],
          description: 'Beautiful 3-bedroom flat with modern amenities in the heart of Lekki.',
          bedrooms: 3,
          bathrooms: 3,
          area: 150,
          rent: {
            amount: 3500000,
            period: 'yearly'
          },
          deposit: 3500000,
          status: 'available',
          approvalStatus: 'approved',
          isActive: true
        },
        {
          title: 'Cozy 2-Bedroom Duplex in Ikeja',
          type: 'duplex',
          landlordId: landlordId,
          landlordContact: {
            phone: '08012345678',
            email: 'landlord@test.com',
            name: 'Test Landlord'
          },
          location: {
            state: 'Lagos',
            city: 'Ikeja',
            lga: 'Ikeja',
            address: '22 Allen Avenue, Ikeja'
          },
          media: [
            { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80' }
          ],
          amenities: ['Parking', 'Security', 'Generator'],
          description: 'Spacious 2-bedroom duplex in a serene environment.',
          bedrooms: 2,
          bathrooms: 2,
          area: 120,
          rent: {
            amount: 2000000,
            period: 'yearly'
          },
          deposit: 2000000,
          status: 'available',
          approvalStatus: 'pending',
          isActive: true
        }
      ];

      const created = await Property.insertMany(testProperties);
      console.log(`✅ Created ${created.length} test properties`);

      created.forEach((prop, idx) => {
        console.log(`\n${idx + 1}. ${prop.title}`);
        console.log(`   ID: ${prop._id}`);
        console.log(`   Approval Status: ${prop.approvalStatus}`);
      });
    } else {
      console.log('\n✅ Properties already exist in database');
      console.log('\n💡 Tip: Use the admin panel to approve properties');
    }

    console.log('\n✅ Done! Disconnecting...\n');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAndSeed();
