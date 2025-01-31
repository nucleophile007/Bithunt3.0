import React, { useState } from "react";
import { Backend_Server } from '../port.js';
const RegisterGateAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      alert("You need to be logged in as superadmin.");
      return;
    }

    try {
      const response = await fetch(`${Backend_Server}/api/auth/register-gateadmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, role: "gateadmin" }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Gate Admin registered successfully!");
        setUsername("");
        setPassword("");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error registering gate admin:", error);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-700">Register Gate Admin</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
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
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterGateAdmin;
