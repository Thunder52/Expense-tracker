import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        trim:true,
        minlength:[3,"fullname is too short"],
        maxlength:[100,"fullname is too long"],
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match: [/^.+@.+\..+$/, "Invalid email"],
        minlength:[5,"email is too short"],
        maxlength:[100,"email is too long"]
    },
    password:{
        type:String,
        required:true,
        minlength:[6,"password is too short"],
        maxlength:[100,"password is too long"]
    },
    image:{
        type:String,
    },
    dob:{
        type:String,
    },
    address:{
        type:String,
        trim:true,
    },
    phone:{
        type:Number,
        validate(value){
            if(value.toString().length!==10){
                throw new Error('phone number is not correct');
            }
        },
    }

})

userSchema.pre('save',async function(next){
        try {
            const hashPassword=await bcrypt.hash(this.password,10);
            this.password=hashPassword;
            next();
        } catch (error) {
            next(err);
        }
});

const User=mongoose.model('User',userSchema);
export default User;