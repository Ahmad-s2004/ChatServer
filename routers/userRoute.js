import {getAllUser, getSingleUser, searchUser} from "../controllers/userController.js"
import express from "express"

const userRouter = express.Router()

userRouter.get("/", getAllUser)
userRouter.get("/search", searchUser)
userRouter.get("/:id", getSingleUser)

export default userRouter