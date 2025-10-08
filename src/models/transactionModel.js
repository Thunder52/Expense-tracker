import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      minlength: [3, "title length is too short"],
      maxlength: [100, "title is too long"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 1,
    },
    type: {
      type: String,
      required: [true, "type is required"],
      enum: ["expense", "income"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
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
      lowercase: true,
    },
    description: {
      type: String,
      minlength: [5, "description si too short"],
      maxlength: [255, "description is too long"],
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("transaction", transactionSchema);
export default Transaction;
