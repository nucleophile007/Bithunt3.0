import React, { useState } from "react";
import { Backend_Server } from '../port';

const SetupGatesAndTeams = () => {
  const [numGates, setNumGates] = useState(0);
  const [numTeams, setNumTeams] = useState(0);
  const [timeInMinutes, setTimeInMinutes] = useState(0); // State for time in minutes

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${Backend_Server}/api/gates/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ numGates, numTeams, timeInMinutes }), // Include timeInMinutes in the request body
      });

      const data = await response.json();
      if (response.ok) {
        alert("Gates and Teams registered successfully!");
        setNumGates(0);
        setNumTeams(0);
        setTimeInMinutes(0); // Reset time input after successful submission
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error setting up gates and teams:", error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-700">Setup Gates and Teams</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Gates</label>
        <input
          type="number"
          value={numGates}
          onChange={(e) => setNumGates(Number(e.target.value))}
          className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Teams</label>
        <input
          type="number"
          value={numTeams}
          onChange={(e) => setNumTeams(Number(e.target.value))}
          className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          required
        />
      </div>

      {/* New input field for time in minutes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Time (in minutes)</label>
        <input
          type="number"
          value={timeInMinutes}
          onChange={(e) => setTimeInMinutes(Number(e.target.value))}
          className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
      >
        Setup
      </button>
    </form>
  );
};

export default SetupGatesAndTeams;
