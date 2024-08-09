const Payment = require("../models/paymentModel");
const mongoose = require("mongoose");

//GET all payments
const getPayments = async (req, res) => {
  const user_id = req.user._id;
  const payments = await Payment.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(payments);
};

//POST a new payment
const createPayment = async (req, res) => {
  const { beneficiary, b_acc_number, amount, status, reference, reason_code } =
    req.body;

  //adding doc to db
  try {
    const user_id = req.user._id;
    const payment = await Payment.create({
      beneficiary,
      b_acc_number,
      amount: parseFloat(amount),
      status,
      reference,
      reason_code,
      user_id,
    });
    res.status(200).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//DELETE an payment
const deletePayment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such payment" });
  }

  const payment = await Payment.findOneAndDelete({ _id: id });

  if (!payment) {
    return res.status(400).json({ error: "No such payment" });
  }

  res.status(200).json(payment);
};

module.exports = {
  getPayments,
  createPayment,
  deletePayment,
};
