const express = require("express");
const connectDB = require("./db");
const dotenv = require("dotenv");
const cors = require("cors");
const metricRoutes = require("./routes/metricroute");
const userRoutes = require("./routes/userroute");

dotenv.config();
const app = express();



connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL  // Replace with your frontend URL

}));
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use("/api/users", userRoutes);
app.use("/api/metrics", metricRoutes);
