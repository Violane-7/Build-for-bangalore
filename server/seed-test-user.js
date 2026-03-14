/**
 * Seed script: creates a test user in the database.
 * Run with:  node seed-test-user.js
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const TEST_USER = {
  name: "Test User",
  email: "hargunmadan9034@gmail.com",
  password: "Test@1234",
  gender: "male",
  dob: new Date("2000-01-01"),
  emailVerified: true,
};

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // Remove existing test user if present
  await User.deleteOne({ email: TEST_USER.email });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(TEST_USER.password, salt);

  const user = await User.create({ ...TEST_USER, password: hashed });

  console.log("\nTest user created successfully!");
  console.log("─────────────────────────────");
  console.log(`  Email:    ${TEST_USER.email}`);
  console.log(`  Password: ${TEST_USER.password}`);
  console.log(`  Verified: true`);
  console.log(`  ID:       ${user._id}`);
  console.log("─────────────────────────────\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
