import jwt from "jsonwebtoken"
import path from "path"
import dotenv from "dotenv"

dotenv.config({
    path: path.resolve("config/.env"),
  });

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: "7d"
    })
}

export default generateToken