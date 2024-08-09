require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const accountRoutes = require("./routes/accounts");
const paymentRoutes = require("./routes/payments");
const transactionRoutes = require("./routes/transactions");
const userRoutes = require("./routes/user");
//const cors = require("cors");

//express app
const app = express();

//middleware
app.use(express.json());

//middleware to handle CORS policy
//app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/accounts", accountRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/user", userRoutes);

//connect to database
mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
