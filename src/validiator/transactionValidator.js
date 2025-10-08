import Joi from "joi";

const validate=(schema)=>(payload)=>schema.validate(payload);

const schema=Joi.object({
    title:Joi.string().trim().min(3).max(100).required(),
    amount:Joi.number().min(1).required(),
    type:Joi.string().required(),
    category:Joi.string().valid("groceries","rent","salary","tip","food","medical","utilities","entertainment","transportation","shopping","others").required(),
    description:Joi.string().min(5).max(255).optional(),
    date:Joi.string().required()
});
export default validate(schema);