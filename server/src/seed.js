require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Competition = require("./models/Competition");

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await Competition.deleteMany({});

  const user = await User.create({
    _id: new mongoose.Types.ObjectId(process.env.DEMO_USER_ID),
    name: "Demo Student",
    email: "demo@feedants.local"
  });

  const now = new Date();
  const start = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const registrationOpen = new Date(now.getTime() - 60 * 60 * 1000);
  const registrationClose = new Date(start.getTime() - 2 * 60 * 60 * 1000);

  const competition = await Competition.create({
    title: "Feedants Innovation Challenge",
    description:
      "Build a practical solution to a real-world problem and present your idea with a working prototype.",
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    startAt: start,
    endAt: end,
    registrationOpenAt: registrationOpen,
    registrationCloseAt: registrationClose,
    capacity: 100,
    status: "PUBLISHED"
  });

  console.log("Seed complete");
  console.log("Demo user:", user._id.toString());
  console.log("Competition:", competition._id.toString());

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
