import { User } from "../Models/userCollection.js";
import bcrypt from 'bcrypt'
import logger from "../Utilis/logger.js";
import jwt from 'jsonwebtoken'
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from 'dotenv'
dotenv.config()

const userController={

    signup:async(req,res)=>{
        try {
            const {name,email,password}=req.body
            const hashpassword=await bcrypt.hash(password,10)
            const existingUser=await User.findOne({email:email})
            if(existingUser){
                logger.warn(`Signup failed: User with email ${email} already exists.`);
                return res.json({success:false,message:"User already registered"})
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
    },
    login:async(req,res)=>{
        try {            
            const{email,password}=req.body;
            const user=await User.findOne({email:email})
            if(!user){
                return res.json({success:false,message:"User not registered"})
            }
            const validPassword=await bcrypt.compare(password,user.password)
            if(!validPassword){
                return res.json({success:false,message:"Incorrect password"})
            }
            const token=jwt.sign({email:user.email},process.env.KEY,{expiresIn:'1h'})            
            res.cookie('token',token,{httpOnly:true,maxAge:360000})
            return res.json({success:true,message:"Login successfully",user,token})
        } catch (error) {
            logger.error(`Error during signin for email ${req.body.email}: ${error.message}`);
            return res.status(500).json({success:false,message:"An error occurred while login the user. Please try again."})
        }
    },
    isVerify:async(req,res)=>{
        try {
            return res.status(200).json({success:true,message:"User verified",user:req.user})
        } catch (error) {
            logger.error(`Verification error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    uploadPdf:async(req,res)=>{
        try {
            const id=req.user._id
            if(!req.file){
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }
            const filePath = `uploads/${req.file.filename}`
            const updatedUser=await User.findByIdAndUpdate({_id:id},{
                $push:{uploadedFile:filePath}
            },{new:true})
            logger.info(`PDF uploaded successfully by user: ${req.user.email}`);
            res.status(200).json({ success: true, message: "PDF uploaded successfully", user: updatedUser });
        } catch (error) {
            logger.error(`Error uploading PDF: ${error.message}`);
            res.status(500).json({ success: false, message: "Error uploading PDF" });
        }
    },
    fetchPdf: async (req, res) => {
        try {
            const userId = req.user._id;
            const user = await User.findById(userId);
    
            if (!user || !user.uploadedFile || user.uploadedFile.length === 0) {
                return res.status(404).json({ success: false, message: "No PDF files found for this user." });
            }
            const pdfFiles = await Promise.all(
                user.uploadedFile.map((filePath, index) => {
                    const absolutePath = path.join(__dirname, '..', filePath);
    
                    return new Promise((resolve, reject) => {
                        fs.readFile(absolutePath, (err, data) => {
                            if (err) {
                                logger.warn(`File not found at path ${absolutePath}`);
                                return reject(new Error(`File not found at ${filePath}`));
                            }
                            resolve({
                                fileName: `user_${userId}_file_${index + 1}.pdf`,
                                base64: data.toString('base64'),
                            });
                        });
                    });
                })
            );
            logger.info(`PDF fetched successfully by user: ${req.user.email}`);
            res.status(200).json({ success: true, message: "PDF files retrieved successfully", pdfs: pdfFiles });
        } catch (error) {
            logger.error(`Error fetching PDFs for user ${req.user.email}: ${error.message}`);
            res.status(500).json({ success: false, message: "Error fetching PDF files" });
        }
    },  
    logout:async(req,res)=>{
        try {
            res.clearCookie('token')
            logger.info(`User successfully logged out: ${req.user.email}`);
            res.status(200).json({ success: true, message: "User logout successfully" });
        } catch (error) {
            logger.error(`Logout error: ${error.message}`);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
export default userController