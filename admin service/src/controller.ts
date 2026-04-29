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

export const addSong = trycatch(
    async (req: authenticatedRequest, res) => {
        if (req.user?.role !== 'admin') {
            res.status(403).json({
                message: "You are not the admin"
            })
            return;
        }
        const { title, description, album_id } = req.body;
        if (!title || !description) {
            res.status(400).json({
                message: "Please input all the details"
            })
            return;
        }

        const isAlbum = await sql`
            SELECT * FROM albums WHERE id=${album_id}
        `

        if (!isAlbum || isAlbum.length == 0) {
            // 404 stands for not found 
            res.status(404).json({
                message: "No album with this Id"
            })
            return;
        }

        const audio = req.file;
        if (!audio) {
            res.status(400).json({
                message: "No file to upload"
            })
            return;
        }

        const fileBuffer = getBuffer(audio)

        if (!fileBuffer || !fileBuffer.content) {
            // 500 means the issue is in backend 
            res.status(500).json({
                message: "Failed to generate file buffer"
            })
            return;
        }

        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
            folder: "songs",
            resource_type: "video"
        });

        const result = await sql`
            INSERT INTO songs (title, description, audio, album_id) VALUES (${title}, ${description}, ${cloud.secure_url}, ${album_id})
        `
        res.status(201).json({
            message: "Song added"
        })
    }
)

export const addThumbnail = trycatch(
    async (req: authenticatedRequest, res: Response) => {
        if (req.user?.role !== 'admin') {
            res.status(401).json({
                message: "You are not admin"
            })
            return;
        }

        const song = await sql`
            SELECT * FROM songs WHERE id=${req.params.id}
        `

        if (!song || song.length == 0) {
            res.status(404).json({
                message: "No song with this ID"
            });
            return;
        }

        const file = req.file;
        if (!file) {
            res.status(400).json({
                message: "No file to upload"
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

        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);

        const result = await sql`
            UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${req.params.id} RETURNING *
        `

        res.status(200).json({
            message: "thumbnail added",
            song: result[0]
        })
    }
)