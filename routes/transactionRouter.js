const express = require("express");
const transactionRouter = express.Router();
const { deleteTransaction,addTransaction, getAllTransaction, editTransaction } = require("../controllers/transactionController");


transactionRouter.post("/add-transaction",addTransaction);
transactionRouter.post("/edit-transaction",editTransaction);
transactionRouter.post("/get-all-transaction",getAllTransaction);
transactionRouter.post("/delete-transaction",deleteTransaction);
module.exports={transactionRouter};