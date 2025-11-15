// Migration script to fix existing properties
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/Property.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/ubani';

async function migrateProperties() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all properties
    const properties = await Property.find({});
    console.log(`\n📊 Found ${properties.length} properties to migrate`);

    let migrated = 0;
    let alreadyMigrated = 0;

    for (const property of properties) {
      console.log(`\n🔍 Checking property: ${property.title || property._id}`);
      console.log(`   Current status: ${property.status}`);
      console.log(`   Current approvalStatus: ${property.approvalStatus || 'NOT SET'}`);

      let needsUpdate = false;
      const updates = {};

      // If status is "approved" (old schema), migrate it
      if (property.status === 'approved' && !property.approvalStatus) {
        updates.approvalStatus = 'approved';
        updates.status = 'available';  // Set to available since it's approved
        needsUpdate = true;
      }

      // If approvalStatus is not set, set it to pending
      if (!property.approvalStatus) {
        updates.approvalStatus = 'pending';
        needsUpdate = true;
      }

      // Ensure bedrooms and bathrooms have default values
      if (property.bedrooms === undefined || property.bedrooms === null) {
        updates.bedrooms = 1;
        needsUpdate = true;
      }

      if (property.bathrooms === undefined || property.bathrooms === null) {
        updates.bathrooms = 1;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await Property.findByIdAndUpdate(property._id, updates);
        console.log(`   ✅ Migrated:`, updates);
        migrated++;
      } else {
        console.log(`   ⏭️  Already migrated`);
        alreadyMigrated++;
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   📝 Migrated: ${migrated} properties`);
    console.log(`   ⏭️  Already migrated: ${alreadyMigrated} properties`);

    // Verify the migration
    console.log('\n🔍 Verifying migration...');
    const approvedCount = await Property.countDocuments({ approvalStatus: 'approved' });
    const pendingCount = await Property.countDocuments({ approvalStatus: 'pending' });
    const notApprovedCount = await Property.countDocuments({ approvalStatus: 'not_approved' });

    console.log(`\n📊 Property counts by approval status:`);
    console.log(`   ✅ Approved: ${approvedCount}`);
    console.log(`   ⏳ Pending: ${pendingCount}`);
    console.log(`   ❌ Not Approved: ${notApprovedCount}`);

    await mongoose.disconnect();
    console.log('\n✅ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

migrateProperties();
