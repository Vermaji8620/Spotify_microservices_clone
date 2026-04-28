import jwt, { type JwtPayload } from "jsonwebtoken"
import type { NextFunction, Request, Response } from 'express'
import { User, type IUser } from './model.js';

export interface AuthenticatedRequest extends Request {
    user?: IUser | null
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.token as string;
        if (!token) {
            res.status(400).json({
                message: "Please login again"
            })
            return;
        }
        const decoded_value = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        if (!decoded_value || !decoded_value._id) {
            res.status(403).json({
                message: "Invalid token",
            })
            return;
        }
        const user_id = decoded_value._id
        const user = await User.findById(user_id).select("-password");

        if (!user) {
            res.status(403).json({
                message: "User not found"
            })
            return;
        }

        req.user = user
        next()
    } catch (error) {
        res.status(400).json({
            message: "Please login"
        })
    }
}