import React, { useEffect, useState } from "react";
import {Backend_Server} from '../port';
const AssignGateAdmin = () => {
  const [gates, setGates] = useState([]);
  const [gateAdmins, setGateAdmins] = useState([]);
  const [selectedGate, setSelectedGate] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("");

  useEffect(() => {
    // Fetch available gates
    const fetchGates = async () => {
      try {
        const response = await fetch(`${Backend_Server}/api/gates/gatenames`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setGates(data.gates || []);
        } else {
          alert(`Error fetching gates: ${data.message}`);
        }
      } catch (error) {
        console.error("Error fetching gates:", error);
      }
    };

    // Fetch gate admins
    const fetchGateAdmins = async () => {
      try {
        const response = await fetch(`${Backend_Server}/api/auth/gateadminsd`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setGateAdmins(data.gateAdmins || []);
        } else {
          alert(`Error fetching gate admins: ${data.message}`);
        }
      } catch (error) {
        console.error("Error fetching gate admins:", error);
      }
    };

    fetchGates();
    fetchGateAdmins();
  }, []);

  const handleAssignAdmin = async (e) => {
    e.preventDefault();
    if (!selectedGate || !selectedAdmin) {
      alert("Please select a gate and a gate admin.");
      return;
    }

    try {
      const response = await fetch(`${Backend_Server}/api/gates/assign-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ gateName: selectedGate, username: selectedAdmin }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Admin ${selectedAdmin} successfully assigned to ${selectedGate}.`);
      } else {
        alert(`Error assigning gate admin: ${data.message}`);
      }
    } catch (error) {
      console.error("Error assigning gate admin:", error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleAssignAdmin}>
      <h2 className="text-xl font-bold text-gray-700">Assign Gate Admin</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Gate</label>
        <select
          value={selectedGate}
          onChange={(e) => setSelectedGate(e.target.value)}
          className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          required
        >
          <option value="">-- Select Gate --</option>
          {gates.map((gate) => (
            <option key={gate._id} value={gate.gateName}>
              {gate.gateName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Gate Admin</label>
        <select
  value={selectedAdmin}
  onChange={(e) => setSelectedAdmin(e.target.value)}
  className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
  required
>
  <option value="">-- Select Gate Admin --</option>
  {gateAdmins.map((admin) => (
    <option key={admin._id} value={admin.username}>
      {admin.username}
    </option>
  ))}
</select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Assign Admin
      </button>
    </form>
  );
};

export default AssignGateAdmin;
