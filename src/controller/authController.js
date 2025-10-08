import User from "../models/userModel.js";
import registerValidator from "../validiator/registerValidator.js";
import loginValidator from "../validiator/loginValidator.js";
import jwt from 'jsonwebtoken'
import cloudinary from "../config/cloudinary.js";
import comparePassword from "../helper/comaparePassword.js";
import { errorHelper } from "../helper/errorHelper.js";
import passwordValidator from "../validiator/passwordValidator.js";
import updateValidator from "../validiator/updateValidator.js";

export const getLogin=(req,res)=>{
   return res.render('login.ejs');
}

export const getRegister=(req,res)=>{
    return res.render('register.ejs')
}

export const getProfile=async(req,res)=>{
    try {
        const id=req.id;
        const user=await User.findById(id);
        return res.render('profile.ejs',{user});
    } catch (error) {
        return errorHelper(res,error);
    }
}

export const register=async(req,res)=>{
    try {
        if(req.file.size/(1024*1024)>5){
            return res.status(400).send('image is too large');
        }
        const {error}=registerValidator(req.body);
        if(error){
            console.log(error);
            return res.status(400).send(error);
        }
        const {fullName,email,password}=req.body;
        const user=await User.findOne({email});
        if(user){
            return res.status(400).send("user already exist!");
        }
        const uploadRes=await cloudinary.uploader.upload(req.file.path);
        const newUser=new User({fullName,email,password,image:uploadRes.secure_url});
        await newUser.save();
        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.cookie('token',token,{httpOnly:true});
        return res.redirect('/home');
    } catch (error) {
        return errorHelper(res,error);
    }
}

export const login=async(req,res)=>{
    try {
        const {error}=loginValidator(req.body);
        if(error){
            console.log(error);
            return res.status(400).send(error);
        }
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).send('user not exist');
        }
        if(!comparePassword(password,user.password)){
            return res.status(400).send("invalid credentials");
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.cookie('token',token,{httpOnly:true});
        return res.redirect('/home');
    } catch (error) {
        return errorHelper(res,error)
    }
}

export const updateProfilePic=async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).send('no image uploaded');
        }
        if(req.file.size/(1024*1024)>5){
            return res.status(400).send("file size is too large");
        }
        const id=req.id;
        const user=await User.findById(id);
        if(!user){
            return res.status(400).send('user not found');
        }
        if(user.image){
        const existingImg=user.image;
        const pubId=existingImg.split("/").pop().split('.')[0];
        await cloudinary.uploader.destroy(pubId);
        }
        const uploadRes=await cloudinary.uploader.upload(req.file.path);
        user.image=uploadRes.secure_url;
        await user.save();
        res.redirect('/home');
    } catch (error) {
        return errorHelper(res,error);
    }
}

export const updatePassword=async(req,res)=>{
    try {
        const {error}=passwordValidator(req.body);
        if(error){
            console.log(error);
            return res.status(400).send('wrong credentials!');
        }
        const {password,newPassword,confirmPassword}=req.body;
        const id=req.id;
        const user=await User.findById(id);
        if(!user){
            return res.status(400).send('user not found');
        }
        if(!comparePassword(password,user.password)){
            return res.status(400).send('Wrong password!');
        }
        user.password=newPassword;
        await user.save();
        return res.status(200).redirect('/home');
    } catch (error) {
        return errorHelper(res,error);
    }
}

export const update=async(req,res)=>{
    try {
        const {error}=updateValidator(req.body);
        if(error){
            console.log(error);
            return res.status(400).send(error);
        }
        const {fullName,phone,address,dob}=req.body;
        const id=req.id;
        const user=await User.findById(id);
        user.fullName=fullName||user.fullName;
        user.phone=phone||user.phone;
        user.address=address||user.address;
        user.dob=dob||user.dob;
        await user.save();
        return res.redirect('/home');
    } catch (error) {
        return errorHelper(res,error);
    }
}

export const logout=(req,res)=>{
    res.clearCookie('token');
    return res.redirect('/login');
}