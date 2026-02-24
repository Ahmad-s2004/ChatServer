import express from "express"
const app = express()
import dotenv from 'dotenv'
import dbconnection from "./config/db.js"
import authRouter from "./routers/authRouter.js" 

dotenv.config()
dbconnection()

app.use(express.json())
app.use("/auth", authRouter)

app.get("/", (req, res) => {
    res.send("API is running...");
  });

const PORT = process.env.PORT || 4550
app.listen(PORT, ()=>{
    console.log(`Server is started at port ${PORT}`)
})



