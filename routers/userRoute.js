import {getAllUser, getSingleUser, searchUser} from "../controllers/userController.js"
import express from "express"

const userRouter = express.Router()

userRouter.get("/", getAllUser)
userRouter.get("/:id", getSingleUser)
userRouter.get("/search", searchUser)

export default userRouter