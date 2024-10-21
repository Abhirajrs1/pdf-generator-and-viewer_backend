import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User } from '../Models/userCollection.js'
dotenv.config()

const authMiddleware={

    userMiddleware:async(req,res,next)=>{
        try {
            const token=req.cookies.token
            if(!token){
                return res.json({message:"Access denied, No token found"})
            }
            const decoded=jwt.verify(token,process.env.KEY)
            const user=await User.findOne({email:decoded.email})
            if(!user){
                return res.status(401).json({message:"User not found"})
            }
            req.user=user
            next()
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}

export default authMiddleware