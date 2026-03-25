import {User} from "../models/index.js"
import generateToken from "../utils/generateToken.js"



let register = async(req, res) =>{
        try {
            const {name, email, password} = req.body

        if(!name || !email || !password){
            return res.status(400).json({success: false, message: "All fields required" })
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({success: false, message:"User already exist"})
        }
        await User.create({name, email, password})
        res.status(201).json({success: true, message:"User created successfully"})
        } catch (error) {
           return res.status(500).json({success: false, message:"Internal server error"})
        }

}

let login = async(req, res)=>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({success: false, message: "All fields required" })
        }
        let existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(404).json({success:false, message:"User not exist. Signup instead"})
        }
        if(existingUser.password !== password){
            return res.status(401).json({success:false, message:"Invalid credentials"})
        }
        let token = generateToken(existingUser._id)
        return res.status(200).json({success:true, message:"login successful", token})
    } catch (error) {
        return res.status(500).json({success:false, message:"Internal server error"})
    }
}


let logout = async(req, res)=>{
    return res.status(200).json({success: true, message: "Logged out successfully"})
}

export {
    login,
    register,
    logout 
}