import Joi from "joi";

const validate=(schema)=>(payload)=>schema.validate(payload);

const passwordSchema=Joi.object({
    password:Joi.string().min(6).max(100).required(),
    newPassword:Joi.string().min(6).max(100).required(),
    confirmPassword:Joi.string().valid(Joi.ref('newPassword')).required()
});

export default validate(passwordSchema);