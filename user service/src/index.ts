import express from "express"
import mongoose from 'mongoose'
import dotenv from "dotenv"
import userRoutes from "./route.js"


dotenv.config()
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("connected")
    } catch (error) {
        console.log(error)
    }
}

const app = express()

app.use(express.json())

app.use("/api/v1", userRoutes)

app.get("/", (req, res) => {
    res.send("app is working")
})

const port = process.env.PORT || 5000

app.listen(5000, () => {
    console.log("server is running on port", port)
    connectDB()
})