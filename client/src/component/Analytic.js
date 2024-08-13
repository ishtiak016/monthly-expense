import { Progress } from "antd";
import React from "react";

const Analytic = ({ allTransaction }) => {
  const categories = [
    "salary",
    "tip",
    "project",
    "food",
    "movie",
    "bill",
    "medical",
    "fee",
    "tax",
  ];
  const totalTransaction = allTransaction.length;
  const totalIncomeTransaction = allTransaction.filter(
    (transaction) => transaction.type === "income"
  );
  const totalExpenseTransaction = allTransaction.filter(
    (transaction) => transaction.type === "expense"
  );
  const totalIncomePercent =
    (totalIncomeTransaction.length / totalTransaction) * 100;
  const totalExpensePercent =
    (totalExpenseTransaction.length / totalTransaction) * 100;

  const totalTrunOver = allTransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalIncomeTrunover = allTransaction
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenseTrunover = allTransaction
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncomeTrunOverPercent =
    (totalIncomeTrunover / totalTrunOver) * 100;
  const totalExpenseTrunOverPercent =
    (totalExpenseTrunover / totalTrunOver) * 100;
  return (
    <>
      <div className="row mt-4 m-4">
        <div className="col-md-4">
          <div className="card mb-4">
            {" "}
            {/* This ensures spacing between the two cards */}
            <div className="card-header">
              Total Transaction : {totalTransaction}
            </div>
            <div className="card-body">
              <h5>Income : {totalIncomeTransaction.length}</h5>
              <h5>Income : {totalExpenseTransaction.length}</h5>
              <Progress
                type="circle"
                strokeColor="green"
                className="mx-2"
                percent={totalIncomePercent.toFixed(0)}
              />
              <Progress
                type="circle"
                strokeColor="red"
                className="mx-2"
                percent={totalExpensePercent.toFixed(0)}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">Total TranOver : {totalTrunOver}</div>
            <div className="card-body">
              <h5 className="text-success">Income : {totalIncomeTrunover}</h5>
              <h5 className="text-danger">Expense : {totalExpenseTrunover}</h5>
              <Progress
                type="circle"
                strokeColor="green"
                className="mx-2"
                percent={totalIncomeTrunOverPercent.toFixed(0)}
              />
              <Progress
                type="circle"
                strokeColor="red"
                className="mx-2"
                percent={totalExpenseTrunOverPercent.toFixed(0)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <h5>Category Wise Income</h5>
          {categories.map((category) => {
            const amount = allTransaction
              .filter(
                (transaction) =>
                  transaction.type === "income" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h4>{category}</h4>
                    <Progress
                      percent={((amount / totalIncomeTrunover) * 100).toFixed(0)}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
        <div className="col-md-4">
          <h5>Category Wise Expense</h5>
          {categories.map((category) => {
            const amount = allTransaction
              .filter(
                (transaction) =>
                  transaction.type === "expense" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card">
                  <div className="card-body">
                    <h4>{category}</h4>
                    <Progress
                      percent={((amount / totalIncomeTrunover) * 100).toFixed(0)}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Analytic;
