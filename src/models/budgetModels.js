import mongoose from "mongoose";

const budgetSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:[true,"title is required"],
        trim:true,
        minlength:[3,"title length is too short"],
        maxlength:[100,"title is too long"],
    },
    category:{
        type:String,
        required:[true,"category is required"],
        enum: [
        "groceries",
        "rent",
        "salary",
        "tip",
        "food",
        "medical",
        "utilities",
        "entertainment",
        "transportation",
        "shopping",
        "others",
      ],
      lowercase:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required"],
        min:1,
    },
    spend:{
        type:Number,
        min:0
    },
    timeFrame:{
        type:String,
        enum:["weekly","monthly","yearly"],
    }
},{timestamps:true});

const Budget=mongoose.model("budget",budgetSchema);
export default Budget;