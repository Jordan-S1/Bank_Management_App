const Transaction = require("../models/transactionModel");
const mongoose = require("mongoose");

//GET all transactions
const getTransactions = async (req, res) => {
  const user_id = req.user._id;
  const transactions = await Transaction.find({ user_id }).sort({
    createdAt: -1,
  });

  res.status(200).json(transactions);
};

//POST a new transaction
const createTransaction = async (req, res) => {
  const { acc_name, t_type, amount, status, reason_code } = req.body;

  //adding doc to db
  try {
    const user_id = req.user._id;
    const transaction = await Transaction.create({
      acc_name,
      t_type,
      amount: parseFloat(amount),
      status,
      reason_code,
      user_id,
    });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//DELETE all transactions
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such transaction" });
  }

  const transaction = await Transaction.findOneAndDelete({ _id: id });

  if (!transaction) {
    return res.status(400).json({ error: "No such transaction" });
  }

  res.status(200).json(transaction);
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
};
