import Joi from "joi";

const validiator=(schema)=>(payload)=>schema.validate(payload);

const userSchema=Joi.object({
    fullName:Joi.string().trim().min(3).max(100).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).max(100).required(),
    confirmPassword:Joi.string().valid(Joi.ref("password")).required()
})

export default validiator(userSchema);