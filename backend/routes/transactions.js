const express = require("express");
const {
  getTransactions,
  createTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all transaction routes
router.use(requireAuth);

//GET all transactions
router.get("/", getTransactions);

//POST a new transaction
router.post("/", createTransaction);

//DELETE a transaction
router.delete("/:id", deleteTransaction);

module.exports = router;
