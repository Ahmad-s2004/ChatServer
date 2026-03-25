import express from "express"
const app = express()
import dotenv from 'dotenv'
import dbconnection from "./config/db.js"
import authRouter from "./routers/authRoute.js" 
import userRouter from "./routers/userRoute.js"
import messageRouter from "./routers/messageRoute.js"
import cookieParser from "cookie-parser"


dotenv.config()
dbconnection()

app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/message", messageRouter)

app.get("/", (req, res) => {
    res.send("API is running...");
  });

const PORT = process.env.PORT || 4550
app.listen(PORT, ()=>{
    console.log(`Server is started at port ${PORT}`)
})



