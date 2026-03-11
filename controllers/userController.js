const User = require("../models/index.js")


const getAllUsers = async (req, res) => {
  try {

    const users = await User.find({ _id: { $ne: req.user._id } })

    res.status(200).json(users)

  } catch (error) {

    res.status(500).json({ message: "Server Error" })

  }
}






module.exports = {
  getAllUsers
}