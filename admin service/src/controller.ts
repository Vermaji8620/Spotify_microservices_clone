import getBuffer from './config/datauri.js'
import cloudinary from "cloudinary"
import trycatch from './trycatch.js'
import type { Request, Response } from 'express'
import { sql } from './config/db.js'

interface authenticatedRequest extends Request {
    user?: {
        _id: string,
        role: string
    }
}

export const addAlbum = trycatch(
    async (req: authenticatedRequest, res: Response) => {
        if (req.user?.role !== "admin") {
            // 403 means unauthorized
            res.status(403).json({
                message: "You are not the admin"
            })
            return;
        }

        const { title, description } = req.body;
        // why are we not importing the previous middleware's multer thing here in this file ? Because - the multer over there, just parses the file to make it available in the memory, rather than the disk, and then make it available at req.file and hence the controller does not need to import multer directly because it only consumes the result, gained from using multer 
        const file = req.file;

        if (!file) {
            // 400 for bad request 
            res.status(400).json({
                message: "No file provided"
            })
            return;
        }

        const fileBuffer = getBuffer(file)

        if (!fileBuffer || !fileBuffer.content) {
            // 500 means the issue is in backend 
            res.status(500).json({
                message: "Failed to generate file buffer"
            })
            return;
        }

        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
            folder: "albums"
        });

        const result = await sql`
            INSERT INTO albums (title, description, thumbnail) VALUES (${title}, ${description}, ${cloud.secure_url}) RETURNING *
        `

        res.status(201).json({
            message: "album created",
            album: result[0]
        })

    }
)