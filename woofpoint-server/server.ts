import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import userRoutes from "./routes/user"

import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 3001;
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", userRoutes)

// Add this to test basic connectivity
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});


mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log("MongoDB Connection ✅")
        app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`))
    })
    .catch((err) => console.error("❌ MongoDB error", err))