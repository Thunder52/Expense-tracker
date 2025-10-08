import express from 'express'
import upload from '../config/upload.js';
import authMiddleware from '../middleware/authMiddleware.js'
import { getLogin,getRegister,getProfile,register,login,updateProfilePic,updatePassword,update,logout } from '../controller/authController.js';
const router=express.Router();


router.get('/',getLogin);
router.get('/login',getLogin);
router.get('/register',getRegister)
router.get('/profile',authMiddleware,getProfile);
router.post('/register',upload.single('profileImage'),register);
router.post('/login',login);
router.post('/update-pic',authMiddleware,upload.single('profileImage'),updateProfilePic);
router.post('/update-password',authMiddleware,updatePassword)
router.post('/update',authMiddleware,update)
router.get('/logout',logout);

export default router;