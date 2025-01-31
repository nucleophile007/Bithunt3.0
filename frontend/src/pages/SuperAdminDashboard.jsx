import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterGateAdmin from "../components/RegisterGateAdmin";
import SetupGatesAndTeams from "../components/SetupGatesAndTeams";
import AssignGateAdmin from "../components/AssignGateAdmin";
import DeleteAllGates from "../components/Deleteallgates";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Superadmin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 shadow rounded">
          <RegisterGateAdmin />
        </div>
        <div className="bg-white p-6 shadow rounded">
          <SetupGatesAndTeams />
        </div>
        <div className="bg-white p-6 shadow rounded">
          <AssignGateAdmin />
        </div>
        <div className="bg-white p-6 shadow rounded">
          <DeleteAllGates />
        </div>
        {/* Add View Teams Button */}
        <div className="bg-white p-6 shadow rounded text-center">
          <button
            onClick={() => navigate("/view-teams")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Teams
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
