import type { NextFunction, Request, Response } from "express"
import multer from "multer"
import axios from 'axios'
import dotenv from "dotenv"

dotenv.config()

interface IUser {
    _id: string,
    email: string,
    name: string,
    password: string,
    role: string,
    playlist: string[]
}

export interface authenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (req: authenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.token as string
        if (!token) {
            res.status(403).json({
                message: "Please login"
            })
            return;
        }

        const { data } = await axios.get(`${process.env.User_URL}/api/v1/user/me`, {
            headers: {
                token
            }
        })

        req.user = data
        next()

    } catch (error) {
        res.status(403).json({
            message: "Please login"
        })
    }
}

// multer setup 
const storage = multer.memoryStorage()
const uploadFile = multer({ storage }).single("file")

export default uploadFile