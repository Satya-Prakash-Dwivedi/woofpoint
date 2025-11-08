import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import userRoutes from "./routes/user.routes"
import trainerRoutes from "./routes/trainer.routes"
import ownerRoutes from "./routes/owner.routes"

import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 3001;
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", userRoutes)
app.use("/api/trainer", trainerRoutes)
app.use("/api/owner", ownerRoutes);

const startServer = async () => {
   try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB Connection ✅");
     app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
   } catch (err) {
     console.error("❌ Failed to start server:", err);
     process.exit(1);
  }
};

 startServer();