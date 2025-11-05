// Fix isActive field for existing properties
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './src/models/Property.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function fixIsActive() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Update all properties that don't have isActive field
    const result = await Property.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );

    console.log(`✅ Updated ${result.modifiedCount} properties with isActive: true\n`);

    // Verify
    const allProperties = await Property.find({});
    console.log('📊 Current properties:\n');

    allProperties.forEach((prop, idx) => {
      console.log(`${idx + 1}. ${prop.title || 'Untitled'}`);
      console.log(`   _id: ${prop._id}`);
      console.log(`   approvalStatus: ${prop.approvalStatus}`);
      console.log(`   isActive: ${prop.isActive}`);
      console.log('');
    });

    // Test the query
    console.log('🔍 Testing query: { approvalStatus: "approved", isActive: true }\n');
    const testResults = await Property.find({ approvalStatus: "approved", isActive: true });
    console.log(`📊 Found ${testResults.length} properties\n`);

    if (testResults.length > 0) {
      testResults.forEach((prop) => {
        console.log(`✅ ${prop.title || 'Untitled'} (${prop._id})`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixIsActive();
