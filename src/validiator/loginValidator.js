import Joi from "joi";

const validate=(schema)=>(payload)=>schema.validate(payload);

const userSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).max(10).required()
});

export default validate(userSchema);