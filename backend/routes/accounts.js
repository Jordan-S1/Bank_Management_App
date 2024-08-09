const express = require("express");
const {
  getAccounts,
  getAccount,
  createAccount,
  deleteAccount,
  updateAccount,
} = require("../controllers/accountController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all account routes
router.use(requireAuth);

//GET all accounts
router.get("/", getAccounts);

//GET a single account
router.get("/:id", getAccount);

//POST a new account
router.post("/", createAccount);

//DELETE an account
router.delete("/:id", deleteAccount);

//UPDATE an account
router.put("/:id", updateAccount);

module.exports = router;
