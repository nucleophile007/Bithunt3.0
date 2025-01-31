import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Backend_Server} from '../port';
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    try {
      const response = await fetch(`${Backend_Server}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Save the token and role to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        //console.log(data.token);

        alert("Login successful!");

        // Redirect based on role
        if (data.role === "superadmin") {
          navigate("/dashboard");
        } else if (data.role === "gateadmin") {
          navigate("/gateadmin-dashboard");
        } else {
          setError("Unknown role. Login failed.");
        }
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow rounded w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Login
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded shadow hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
