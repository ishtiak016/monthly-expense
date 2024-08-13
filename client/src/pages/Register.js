import React, { useState ,useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../component/Layout/Spinner";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (values) => {
    setLoading(true);
  
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        // Assuming the server responds with a JSON error message
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }
      
      message.success("Registration successful");
      navigate("/");
    } catch (error) {
      // Displaying only the error message, not the entire error object
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    if(localStorage.getItem('user')){
      navigate("/");
    }
  },[navigate]);

  return (
    <div className="register-page">
      {loading && <Spinner />}
      <Form layout="vertical" onFinish={submitHandler}>
        <h1>Register Form</h1>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
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
          <Link to="/login">Already registered? Click here to login</Link>
          <button className="btn btn-primary" type="submit">Register</button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
