import { User } from "../Models/userCollection.js";
import bcrypt from 'bcrypt'
import logger from "../Utilis/logger.js";

const userController={

    signup:async(req,res)=>{
        try {
            const {name,email,password}=req.body
            const hashpassword=await bcrypt.hash(password,10)
            const existingUser=await User.findOne({email:email})
            if(existingUser){
                logger.warn(`Signup failed: User with email ${email} already exists.`);
                return res.status(400).json({success:false,message:"User already registered"})
            }
            const newUser=new User({
                name:name,
                email:email,
                password:hashpassword
            })
            await newUser.save()
            logger.info(`User registered successfully with email: ${email}`)
            return res.status(201).json({success:true,message:"User registered successfully"})
        } catch (error) {
            logger.error(`Error during signup for email ${req.body.email}: ${error.message}`);
            return res.status(500).json({success:false,message:"An error occurred while registering the user. Please try again."})
        }
    }
}
export default userController