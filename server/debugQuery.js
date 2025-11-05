// Debug script to check exact query
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './src/models/Property.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function debugQuery() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check all properties
    const allProperties = await Property.find({});
    console.log(`📊 Total properties in database: ${allProperties.length}\n`);

    allProperties.forEach((prop, idx) => {
      console.log(`${idx + 1}. ${prop.title || 'Untitled'}`);
      console.log(`   _id: ${prop._id}`);
      console.log(`   status: ${prop.status}`);
      console.log(`   approvalStatus: ${prop.approvalStatus}`);
      console.log(`   isActive: ${prop.isActive}`);
      console.log('');
    });

    // Test the exact query from the API
    console.log('🔍 Testing exact API query: { approvalStatus: "approved", isActive: true }\n');
    const apiQuery = {
      approvalStatus: "approved",
      isActive: true
    };

    const apiResults = await Property.find(apiQuery);
    console.log(`📊 Results: ${apiResults.length} properties\n`);

    if (apiResults.length > 0) {
      apiResults.forEach((prop, idx) => {
        console.log(`${idx + 1}. ${prop.title || 'Untitled'}`);
        console.log(`   _id: ${prop._id}`);
      });
    } else {
      console.log('❌ No properties match the query!\n');

      // Check approved properties without isActive filter
      console.log('🔍 Checking approved properties (without isActive filter)...\n');
      const approvedOnly = await Property.find({ approvalStatus: "approved" });
      console.log(`📊 Found ${approvedOnly.length} approved properties:\n`);

      approvedOnly.forEach((prop, idx) => {
        console.log(`${idx + 1}. ${prop.title || 'Untitled'}`);
        console.log(`   _id: ${prop._id}`);
        console.log(`   approvalStatus: ${prop.approvalStatus}`);
        console.log(`   isActive: ${prop.isActive}`);
        console.log('');
      });

      // Check active properties without approvalStatus filter
      console.log('🔍 Checking active properties (without approvalStatus filter)...\n');
      const activeOnly = await Property.find({ isActive: true });
      console.log(`📊 Found ${activeOnly.length} active properties:\n`);

      activeOnly.forEach((prop, idx) => {
        console.log(`${idx + 1}. ${prop.title || 'Untitled'}`);
        console.log(`   _id: ${prop._id}`);
        console.log(`   approvalStatus: ${prop.approvalStatus}`);
        console.log(`   isActive: ${prop.isActive}`);
        console.log('');
      });
    }

    await mongoose.disconnect();
    console.log('✅ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugQuery();
