const transectionModel = require("../models/transactionModel");
const moment = require("moment");
const getAllTransaction = async (req, res) => {
  const { days, userid, type } = req.body;
    console.log(type);
  try {
    const startDate = moment()
      .subtract(days, "days")
      .startOf("day")
      .utc()
      .toDate();
    console.log("Start Date:", startDate);

    // Fetch transactions
    const allTransaction = await transectionModel.find({
      userid: userid,
      ...(type !== "all" && { type }),
      date: {
        $gt: startDate, // Fetch transactions from the UTC start date
      },
    
    });

    //  console.log("Fetched Transactions:", allTransaction);
    res.status(200).json(allTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addTransaction = async (req, res) => {
  try {
   
    const newTransaction = new transectionModel(req.body);
    await newTransaction.save();
    res.status(201).send("Transaction created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const editTransaction=async(req,res)=>{
try {
  await transectionModel.findOneAndUpdate({_id:req.body.transactionId},req.body.payload);
  res.status(200).json("Edited Successfully");
} catch (error) {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
}
}
const deleteTransaction=async(req,res)=>{
  try {
    await transectionModel.findOneAndDelete({_id:req.body.transactionId});
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }

}
module.exports = { getAllTransaction, addTransaction ,editTransaction,deleteTransaction};
