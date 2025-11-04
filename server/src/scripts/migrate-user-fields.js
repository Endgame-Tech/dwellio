import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const migrateUserFields = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/ubani";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Check existing indexes
    const indexes = await usersCollection.indexes();
    console.log(
      "Existing indexes:",
      indexes.map((i) => i.key)
    );

    // Drop old indexes if they exist
    try {
      await usersCollection.dropIndex("phone_1");
      console.log("Dropped phone_1 index");
    } catch (err) {
      console.log("phone_1 index does not exist or already dropped");
    }

    try {
      await usersCollection.dropIndex("username_1");
      console.log("Dropped username_1 index");
    } catch (err) {
      console.log("username_1 index does not exist or already dropped");
    }

    // Update existing documents to use new field names
    const result = await usersCollection.updateMany({}, [
      {
        $set: {
          firstName: {
            $ifNull: [
              "$firstName",
              { $arrayElemAt: [{ $split: ["$fullName", " "] }, 0] },
            ],
          },
          lastName: {
            $ifNull: [
              "$lastName",
              { $arrayElemAt: [{ $split: ["$fullName", " "] }, 1] },
            ],
          },
          phoneNumber: { $ifNull: ["$phoneNumber", "$phone"] },
        },
      },
      {
        $unset: ["phone", "username"],
      },
    ]);

    console.log(`Updated ${result.modifiedCount} documents`);

    // Create new indexes
    await usersCollection.createIndex({ phoneNumber: 1 }, { unique: true });
    console.log("Created phoneNumber_1 index");

    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log("Created email_1 index (if not exists)");

    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateUserFields();
