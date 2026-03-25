import jwt from "jsonwebtoken"
import {User} from "../models/index.js"
import path from "path"
import dotenv from "dotenv"

dotenv.config({
    path: path.resolve("../config/.env"),
  });

const auth = async (req, res, next) => {
    try {
        let token

        if (req.cookies && req.cookies.token) {
            token = req.cookies.token
        } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            return res.status(401).json({ message: "Please login first" })
        }

        const decodedData = jwt.verify(token, process.env.SECRET_KEY)

        const existingUser = await User.findById(decodedData.id).select("-password")

        if (!existingUser) {
            return res.status(401).json({ message: "User not found" })
        }

        req.user = existingUser
        next()

    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}

export default auth