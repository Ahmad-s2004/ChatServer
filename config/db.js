import mongoose from "mongoose"
import path from "path"
import dotenv from "dotenv"

dotenv.config({
    path: path.resolve("config/.env"),
  });

let dbconnection = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Database connected successfully, `)
    } catch (error) {
        console.log(`Database not connected ${error}`)
    }
}

export default dbconnection
