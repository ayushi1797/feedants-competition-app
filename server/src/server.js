require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const competitionRoutes = require("./routes/competition.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Feedants API is running" });
});

app.use("/api/competitions", competitionRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  });
