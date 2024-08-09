const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    acc_name: {
      type: String,
      required: true,
    },
    acc_number: {
      type: Number,
      unique: true,
    },
    acc_type: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
