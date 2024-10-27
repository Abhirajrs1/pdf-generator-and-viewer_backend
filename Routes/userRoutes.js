import express from 'express'
import multer from 'multer'
import userController from '../Controller/userController.js'
import Middleware from '../Middleware/authMiddleware.js'
const authMiddleware=Middleware.userMiddleware
const storage=multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix); 
    }
});
const upload=multer({storage:storage})




const router=express.Router()

router.post('/user-signup',userController.signup)
router.post('/user-login',userController.login)
router.get('/verify',authMiddleware,userController.isVerify)
router.post('/upload-pdf',authMiddleware,upload.single('pdf'),userController.uploadPdf)
router.get('/fetchPdf',authMiddleware,userController.fetchPdf)
router.post('/regenerate-pdf',authMiddleware,userController.regeneratePdf)
router.get('/logout',authMiddleware,userController.logout)











export {router as UserRouter}