import {getAllUser, getSingleUser, searchUser} from "../controllers/userController.js"
import express from "express"
import auth from "../middlewares/auth.js"
const userRouter = express.Router()

userRouter.get("/", auth, getAllUser)
userRouter.get("/search", auth, searchUser)
userRouter.get("/:id", auth, getSingleUser)

export default userRouter