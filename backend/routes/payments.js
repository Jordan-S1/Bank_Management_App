const express = require("express");
const {
  getPayments,
  createPayment,
  deletePayment,
} = require("../controllers/paymentController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all payment routes
router.use(requireAuth);

//GET all payments
router.get("/", getPayments);

//POST a new payment
router.post("/", createPayment);

//DELETE a payment
router.delete("/:id", deletePayment);

module.exports = router;
