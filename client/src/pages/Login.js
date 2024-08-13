import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../component/Layout/Spinner";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (values) => {
    console.log("Submitting:", values); // Log the values being submitted
    try {
      setLoading(true);

      // Send POST request using fetch
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      // Check if response is OK (status in the range 200-299)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      const data = await response.json();
      console.log("Response:", data); // Log the response
      message.success("Login Success");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, password: "" })
      );
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.error("Error:", error); // Log the error
      message.error("Login Fail");
    }
  };
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="login-page">
      {loading && <Spinner />}
      <Form layout="vertical" onFinish={submitHandler}>
        <h1>Login Form</h1>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input type="password" />
        </Form.Item>
        <div className="d-flex justify-content-between">
          <Link to="/register">
            Don't have an account? Click here to register
          </Link>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
