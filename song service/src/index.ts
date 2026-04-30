import express from "express"
import dotenv from "dotenv"
import redis from "redis"
import songRoutes from "./route.js"
import cors from "cors"


export const redisClient = redis.createClient({
    password: process.env.Redis_Password as string,
    socket: {
        host: "redis-19891.crce179.ap-south-1-1.ec2.cloud.redislabs.com",
        port: 19891
    }
})

redisClient.connect().then(() => {
    console.log("Redis connected")
}).catch((error) => { console.log(error) })

const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())

app.use("/api/v1", songRoutes)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})