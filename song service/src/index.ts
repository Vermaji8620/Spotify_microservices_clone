import express from "express"
import dotenv from "dotenv"
import songRoutes from "./route.js"

const app = express()
dotenv.config()

app.use("/api/v1", songRoutes)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})