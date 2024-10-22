import express from 'express'
import multer from 'multer'
import userController from '../Controller/userController.js'
import Middleware from '../Middleware/authMiddleware.js'
const authMiddleware=Middleware.userMiddleware
const storage=multer.memoryStorage()
const upload=multer({storage:storage})




const router=express.Router()

router.post('/user-signup',userController.signup)
router.post('/user-login',userController.login)
router.get('/verify',authMiddleware,userController.isVerify)
router.post('/upload-pdf',authMiddleware,upload.single('pdf'),userController.uploadPdf)
router.get('/fetchPdf',authMiddleware,userController.fetchPdf)
router.post('/regenerate-pdf',authMiddleware,userController.regeneratePdf)
router.delete('/delete-pdf/:id',authMiddleware,userController.deletePdf)
router.get('/logout',authMiddleware,userController.logout)











export {router as UserRouter}