import React from "react";
import { useState } from "react";
import {Backend_Server} from '../port';
const DeleteAllGates = () => {
  const handleDeleteAllGates = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete all gates? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${Backend_Server}/api/gates/deletegates`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert("All gates deleted successfully!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting gates:", error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleDeleteAllGates}>
      <h2 className="text-xl font-bold text-red-600">Delete All Gates</h2>
      <p className="text-sm text-gray-600">
        Caution: This action will delete all gates from the system and cannot be undone.
        Only proceed if you are certain.
      </p>
      <button
        type="submit"
        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
      >
        Delete All Gates
      </button>
    </form>
  );
};

export default DeleteAllGates;