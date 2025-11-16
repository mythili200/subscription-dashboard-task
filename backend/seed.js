require("dotenv").config();
const connectDB = require("./config/db");
const seedPlans = require("./utils/seedPlans");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await seedPlans();

    const adminEmail = "admin@example.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin user created: admin@example.com / admin123");
    } else {
      console.log("Admin already exists, skipping creation.");
    }

    console.log("Seed completed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
