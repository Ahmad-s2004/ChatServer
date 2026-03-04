import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const auth = async (req, res, next) => {
    try {
        const token = req.cookies?.token

        if (!token) return res.status(401).json({ message: "Login required" })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id).select("-password")

        next()
    } catch (err) {
        res.status(401).json({ message: "Unauthorized" })
    }
}

export default auth