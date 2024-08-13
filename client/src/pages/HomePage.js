import React, { useEffect, useState } from "react";
import Layout from "../component/Layout/Layout";
import { Form, Input, message, Modal, Select, Table, DatePicker } from "antd";
import Spinner from "../component/Layout/Spinner";
import moment from 'moment'
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Analytic from "../component/Analytic";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);
  useEffect(() => {
    const getAlltransaction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const response = await fetch(
          "http://localhost:8000/api/get-all-transaction",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userid: user._id,
              frequency,
              type,
            }),
          }
        );

        const data = await response.json();
        setAllTransaction(data);

        setLoading(false);
      } catch (error) {
        console.log(error);
        message.error(error.message);
        setLoading(false);
      }
    };
    getAlltransaction();
  }, [frequency, type]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => new Date(date).toLocaleDateString(), // Format date for display
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Action",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined className="mx-2" onClick={()=>{
            deletehandler(record);
          }}/>
        </div>
      ),
    },
  ];
  const deletehandler=async(record)=>{
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/delete-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId: record._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setLoading(false);
      message.success("Transaction Delete successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("unable to delete");
    }

  }
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (editable) {
        const response = await fetch(
          "http://localhost:8000/api/edit-transaction",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payload:{
                ...values,
                userid: user._id,
              },
              transactionId: editable._id,
              
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        setLoading(false);
        message.success("Transaction Edited successfully");
      } else {
        const response = await fetch(
          "http://localhost:8000/api/add-transaction",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...values, userid: user._id }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        setLoading(false);
        message.success("Transaction added successfully");
      }

      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
        </div>
        <div>
          <h6>Select Type</h6>
          <Select
            value={type}
            onChange={(values) => {
              setType(values);
            }}
          >
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
            <Select.Option value="income">Income</Select.Option>
          </Select>
        </div>
        {frequency === "custom" && (
          <div>
            <h6>Select Date Range</h6>
            <RangePicker
              onChange={(dates) => setCustomDateRange(dates)}
              format="YYYY-MM-DD"
            />
          </div>
        )}
        ;
        <div className="switch-icon-container">
          <div className="mx-2">
            <UnorderedListOutlined
              className={`mx-2 ${
                viewData === "table" ? "active-icon" : "inactive-icon"
              }`}
              onClick={() => setViewData("table")}
            />
            <AreaChartOutlined
              className={`mx-2 ${
                viewData === "analytics" ? "active-icon" : "inactive-icon"
              }`}
              onClick={() => setViewData("analytics")}
            />
          </div>
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {viewData === "table" ? (
          <Table columns={columns} dataSource={allTransaction} />
        ) : (
          <Analytic allTransaction={allTransaction} />
        )}
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={submitHandler}
          initialValues={editable}
        >
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select type" }]}
          >
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bill">Bill</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
