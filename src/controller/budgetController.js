import { errorHelper } from "../helper/errorHelper.js";
import Budget from "../models/budgetModels.js";
import User from "../models/userModel.js";
import budgetValidator from "../validiator/budgetValidator.js";

export const getBudget=async(req,res)=>{
    try {
        const id=req.id;
        const user=await User.findById(id);
        const page=Number(req.query.page)||1;
        const limit=4;
        const skip=(page-1)*limit;
        const total=await Budget.countDocuments({userId:id});
        const budgets=await Budget.find({userId:id}).skip(skip).limit(limit);
        
        return res.render('budget.ejs',{user,budgets,totalPage:Math.ceil(total/limit),currPage:page});
    } catch (error) {
        return errorHelper(res,error);
    }
}

export const addBudget=async(req,res)=>{
    try {
        const id=req.id;
        const {error}=budgetValidator(req.body);
        if(error){
            console.log(error)
            return res.status(400).json(error);
        }
        let {title,category,amount,timeFrame}=req.body;
        const budget=new Budget({userId:id,title,category,amount,timeFrame});
        await budget.save();
        return res.redirect('/budget');
    } catch (error) {
        return errorHelper(res, error);
    }
}