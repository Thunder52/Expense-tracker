import { errorHelper } from "../helper/errorHelper.js";
import Transaction from "../models/transactionModel.js";
import transactionValidator from "../validiator/transactionValidator.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import { stringify } from "csv-stringify";
import Budget from "../models/budgetModels.js";

export const getHome = async (req, res) => {
  try {
    const id = req.id;
    const user = await User.findById(id);
    let totalBalance = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id),
          type: "income",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const totalExpense = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id),
          type: "expense",
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const categories = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
        },
      },
    ]);
    const totalBudget = await Budget.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const totalSpending=await Budget.aggregate([
      {
        $match:{
          userId:new mongoose.Types.ObjectId(id)
        }
      },
      {
        $group:{
          _id:null,
          totalAmount:{$sum:'$spend'}
        }
      }
    ]);
    let budgetPercent=0;
    if(totalSpending[0]?.totalAmount===0){
      budgetPercent=100;
    }else{
      budgetPercent=(totalSpending[0]?.totalAmount/totalBudget[0]?.totalAmount)*100;
    }
    const currBalance =
      totalBalance[0]?.totalAmount - totalExpense[0]?.totalAmount;
    const labelData = categories.map((c) => c.category);
    const data = categories.map((c) => c.totalAmount);
    return res.render("home.ejs", {
      user,
      totalBalance: totalBalance[0]?.totalAmount || 0,
      totalExpense: totalExpense[0]?.totalAmount || 0,
      currBalance,
      labelData: JSON.stringify(labelData),
      data: JSON.stringify(data),
      budgetPercent:budgetPercent.toFixed(2),
    });
  } catch (error) {
    return errorHelper(res, error);
  }
};

export const getTransaction = async (req, res) => {
  try {
    const id = req.id;
    const page = Number(req.query.page) || 1;
    const search = req.query.search;
    const limit = 10;
    const skip = (page - 1) * limit;
    const user = await User.findById(id);
    if (search) {
      const total = await Transaction.find({
        userId: id,
        category: search,
      }).countDocuments();
      const transactions = await Transaction.find({
        userId: id,
        category: search,
      })
        .skip(skip)
        .limit(limit);
      return res.render("transaction.ejs", {
        user,
        transactions,
        totalPage: Math.ceil(total / limit),
        curPage: page,
      });
    }
    const total = await Transaction.find({ userId: id }).countDocuments();
    const transactions = await Transaction.find({ userId: id })
      .skip(skip)
      .limit(limit);
    return res.render("transaction.ejs", {
      user,
      transactions,
      totalPage: Math.ceil(total / limit),
      curPage: page,
    });
  } catch (error) {
    return errorHelper(res, error);
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { error } = transactionValidator(req.body);
    if (error) {
      console.log(error);
      return res.status(400).send(error);
    }
    const id = req.id;
    let { title, amount, type, category, description, date } = req.body;
    description = description || "";
    const transaction = new Transaction({
      userId: id,
      title,
      amount,
      type,
      category,
      description,
      date,
    });
    const budget = await Budget.findOne({ category, userId: id });
    if (budget) {
      if (type === "expense") {
        budget.spend = (budget.spend || 0) + Number(amount);
        budget.save();
      }
    }
    await transaction.save();
    return res.redirect("/home");
  } catch (error) {
    return errorHelper(res, error);
  }
};

export const exportCsv = async (req, res) => {
  try {
    const id = req.id;
    const transactions = await Transaction.find({ userId: id }).lean();
    const columns = [
      { key: "date", header: "Date" },
      { key: "type", header: "Type" },
      { key: "category", header: "Category" },
      { key: "amount", header: "Amount" },
      { key: "description", header: "Notes" },
    ];

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.csv"
    );

    const stringifier = stringify({ header: true, columns });

    transactions.forEach((row) => {
      stringifier.write({
        date: row.date,
        type: row.type,
        category: row.category,
        amount: row.amount,
        description: row.description,
      });
    });

    stringifier.pipe(res);
    stringifier.end();
  } catch (error) {
    return errorHelper(res, error);
  }
};
