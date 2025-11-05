// Check data types
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function checkDataTypes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collection = db.collection('properties');

    const properties = await collection.find({}).toArray();

    console.log(`📊 Found ${properties.length} properties\n`);

    properties.forEach((prop, idx) => {
      console.log(`${idx + 1}. ${prop.title || 'Untitled'} (${prop._id})`);
      console.log(`   status: ${prop.status} (type: ${typeof prop.status})`);
      console.log(`   approvalStatus: ${prop.approvalStatus} (type: ${typeof prop.approvalStatus})`);
      console.log(`   isActive: ${prop.isActive} (type: ${typeof prop.isActive})`);
      console.log(`   Raw isActive value:`, JSON.stringify(prop.isActive));
      console.log('');
    });

    // Try different query variations
    console.log('🔍 Testing query variations:\n');

    console.log('1. Query: { isActive: true }');
    let result = await collection.find({ isActive: true }).toArray();
    console.log(`   Result: ${result.length} properties\n`);

    console.log('2. Query: { isActive: { $eq: true } }');
    result = await collection.find({ isActive: { $eq: true } }).toArray();
    console.log(`   Result: ${result.length} properties\n`);

    console.log('3. Query: { isActive: { $exists: true } }');
    result = await collection.find({ isActive: { $exists: true } }).toArray();
    console.log(`   Result: ${result.length} properties\n`);

    console.log('4. Query: { approvalStatus: "approved" }');
    result = await collection.find({ approvalStatus: "approved" }).toArray();
    console.log(`   Result: ${result.length} properties\n`);

    console.log('5. Query: { approvalStatus: "approved", isActive: true }');
    result = await collection.find({ approvalStatus: "approved", isActive: true }).toArray();
    console.log(`   Result: ${result.length} properties\n`);

    await mongoose.disconnect();
    console.log('✅ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDataTypes();
