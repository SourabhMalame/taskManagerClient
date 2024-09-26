import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirecting
import axios from "axios"; // Import axios for API calls

const API_URL = "http://localhost:5000/api/users"; // Your API base URL

const Login = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const userData = await loginUser({ email, password }); // Call the loginUser function
      localStorage.setItem("token", userData.token); // Store token in local storage
      localStorage.setItem("id", userData.email);
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      setErrorMessage("Invalid credentials, please try again."); // Set error message for invalid credentials
      console.error("Login error:", error); // Log error for debugging
    }
  };

  // Define the loginUser function
  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials); // Make POST request to login endpoint
      console.log(response.data.user._id);
      localStorage.setItem("id", response.data.user.email);
      return response.data; // Return user data
    } catch (error) {
      console.error("API error:", error); // Log error for debugging
      throw error; // Throw error to be caught in handleSubmit
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Login</h3>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}{" "}
        {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <hr />
          <div>
            <span>New Task Manager </span>
            <Link to="/signup"> Register Here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
