const Account = require("../models/accountModel");
const mongoose = require("mongoose");

//GET all accounts
const getAccounts = async (req, res) => {
  const user_id = req.user._id;
  const accounts = await Account.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(accounts);
};

//GET a single account
const getAccount = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such account" });
  }

  const account = await Account.findById(id);

  if (!account) {
    return res.status(404).json({ error: "No such account" });
  }

  res.status(200).json(account);
};

//POST a new account
const createAccount = async (req, res) => {
  const { acc_name, acc_number, acc_type, balance } = req.body;

  let emptyFields = [];

  if (!acc_name) {
    emptyFields.push("acc_name");
  }
  if (!acc_type) {
    emptyFields.push("acc_type");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields", emptyFields });
  }

  //adding doc to db
  try {
    const user_id = req.user._id;
    const account = await Account.create({
      acc_name,
      acc_number,
      acc_type,
      balance: parseFloat(balance),
      user_id,
    });
    res.status(200).json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//DELETE an account
const deleteAccount = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such account" });
  }

  const account = await Account.findOneAndDelete({ _id: id });

  if (!account) {
    return res.status(400).json({ error: "No such account" });
  }

  res.status(200).json(account);
};

//UPDATE an account
const updateAccount = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such account" });
  }

  const account = await Account.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );

  if (!account) {
    return res.status(400).json({ error: "No such account" });
  }

  res.status(200).json(account);
};

module.exports = {
  getAccounts,
  getAccount,
  createAccount,
  deleteAccount,
  updateAccount,
};
