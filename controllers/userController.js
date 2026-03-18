import { User } from "../models/index.js"

const getAllUser = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({message: "Server Error"})
    console.log(error)
  }
}

const getSingleUser = async (req, res) => {
    try {
      const { id } = req.params
      const user = await User.findById(id)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: "Server Error" })
    }
  }
  
  const searchUser = async (req, res) => {
    try {
      const keyword = req.query.search
        ? {$or: [
              { name: { $regex: req.query.search, $options: "i" } },
              { email: { $regex: req.query.search, $options: "i" } }]
          }
        : {}
      const users = await User.find(keyword).find({_id: req.user._id})
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: "Server Error" })
    }
  }

export {
  getAllUser,
  getSingleUser,
  searchUser
}