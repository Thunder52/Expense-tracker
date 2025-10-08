import Joi from "joi";

const validate=(schema)=>(payload)=>schema.validate(payload);

const schema=Joi.object({
    title:Joi.string().min(3).max(30).required(),
    category:Joi.string().valid("groceries","rent","salary","tip","food","medical","utilities","entertainment","transportation","shopping","others").required(),
    amount:Joi.number().min(1).required(),
    timeFrame:Joi.string().valid("weekly","monthly","yearly").required()
})

export default validate(schema);