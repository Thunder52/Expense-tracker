import Joi from "joi";

const validate=(schema)=>(payload)=>schema.validate(payload);

const schema=Joi.object({
    fullName:Joi.string().min(3).max(100).optional(),
    phone:Joi.string().length(10).pattern(/^[0-9]+$/).optional(),
    address: Joi.string().allow('').optional(),
    dob: Joi.string().allow('').optional()
})

export default validate(schema)