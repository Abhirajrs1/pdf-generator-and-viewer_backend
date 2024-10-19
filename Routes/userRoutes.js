import express from 'express'
import multer from 'multer'
import userController from '../Controller/userController.js'




const router=express.Router()

router.post('/user-signup',userController.signup)











export {router as UserRouter}