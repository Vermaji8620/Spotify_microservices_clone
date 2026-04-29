import express from "express"
import adminRoutes from "./route.js"
import dotenv from "dotenv"
import { sql } from './config/db.js'
import cloudinary from 'cloudinary'

const app = express()

app.use(express.json())

dotenv.config()

cloudinary.v2.config(
    {
        cloud_name: process.env.Cloud_Name!,
        api_key: process.env.Cloud_Api_key!,
        api_secret: process.env.Cloud_Api_Secret!,
    }
)

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS albums(
                id SERIAL PRIMARY KEY, 
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                thumbnail VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
            )
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS songs(
                id SERIAL PRIMARY KEY, 
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                thumbnail VARCHAR(255),
                audio VARCHAR NOT NULL,
                album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
            )
        `;

        console.log("database initialised successfully")
    } catch (error) {
        console.log("error initDB", error)
    }
}

const PORT = process.env.PORT || 7000

app.use('/api/v1', adminRoutes)

initDB().then(() => {
    console.log("Neon postgres connected successfully")
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})