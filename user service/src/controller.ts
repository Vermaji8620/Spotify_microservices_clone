import { User } from './model.js';
import bcrypt from "bcrypt"
import trycatch from './trycatch.js';
import jwt from "jsonwebtoken"
import type { AuthenticatedRequest } from './middleware.js';

export const registerUser = trycatch(async (req, res) => {

    const { name, email, password } = req.body
    let user = await User.findOne({ email })

    if (user) {
        return res.status(400).json({
            message: "user already exists"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)
    user = await User.create({
        name, email, password: hashPassword
    })

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" })

    res.status(201).json({ message: "User registered", user, token })

})

export const loginUser = trycatch(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({
            message: "User not exists"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid Password"
        })
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

    res.status(200).json({
        message: "User login successful",
        token,
        user
    })

})

export const myprofile = trycatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user
    res.json(user)
})
