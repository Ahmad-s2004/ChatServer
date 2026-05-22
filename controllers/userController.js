import { User } from "../models/index.js"
import { onlineUsers } from "../index.js"

const getAllUser = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id; 
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    const usersWithStatus = users.map(user => {
      const userObj = user.toObject(); 
      userObj.isOnline = onlineUsers.has(userObj._id.toString());
      
      return userObj;
    });

    res.status(200).json(usersWithStatus)
  } catch (error) {
    res.status(500).json({message: "Server Error"})
    console.log(error)
  }
}

const getSingleUser = async (req, res) => {
    try {
      const { id } = req.params
      const user = await User.findById(id).select("-password")
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
      
      const userObj = user.toObject();
      userObj.isOnline = onlineUsers.has(userObj._id.toString());

      res.status(200).json(userObj)
    } catch (error) {
      res.status(500).json({ message: "Server Error" })
    }
  }
  
  const searchUser = async (req, res) => {
    try {
      const loggedInUserId = req.user?._id;
      const searchPattern = req.query.search;

      let query = {};

      if (searchPattern) {
        query = {
          $and: [
            { _id: { $ne: loggedInUserId } },
            {
              $or: [
                { name: { $regex: searchPattern, $options: "i" } },
                { email: { $regex: searchPattern, $options: "i" } }
              ]
            }
          ]
        };
      } else {
        query = { _id: { $ne: loggedInUserId } };
      }

      const users = await User.find(query).select("-password");

      const usersWithStatus = users.map(user => {
        const userObj = user.toObject();
        userObj.isOnline = onlineUsers.has(userObj._id.toString());
        return userObj;
      });

      res.status(200).json(usersWithStatus)
    } catch (error) {
      res.status(500).json({ message: "Server Error" })
      console.log(error)
    }
  }

let getCurrentUser = async (req, res) => {
    try {
      // let userId =
        const user = await User.findById(req.user?._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


export {
  getAllUser,
  getSingleUser,
  searchUser,
  getCurrentUser
}