import React, { useState, useEffect,useRef } from "react";
import { fetchAssignedGate, updateGateStatus } from "../api/api"; // Ensure these functions are implemented correctly

const GateAdminDashboard = () => {
  const [gate, setGate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editableIndex, setEditableIndex] = useState(null);
  const [tempScore, setTempScore] = useState(null);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(null);

  // Fetch assigned gate when the component mounts
  useEffect(() => {
    const fetchGate = async () => {
      try {
        const data = await fetchAssignedGate(); 
        console.log("Fetched Gate Data:", data);
  
        if (data?.gate) {
          setGate(data.gate); 
          setError(null); // Clear any previous errors
        } else {
          setError("No gate data found.");
        }
      } catch (error) {
        console.error("Error fetching assigned gate:", error.message);
        setError(error.message || "You are not assigned to any gate.");
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch immediately
    fetchGate();
  
    // Refresh every 1 second
    const intervalId = setInterval(fetchGate, 1000);
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to get the highest score
  const getHighestScore = () => {
    if (gate && gate.teams) {
      return Math.max(...gate.teams.map(team => team.score));
    }
    return 0;
  };

  // Handle team status or score updates
  
  const countdownTimerRef = useRef(null); // Store timeout reference

  const handleStatusUpdate = async (teamIndex, updates) => {
    try {
      console.log("Updating gate status...", updates);
      
      // Send update to backend
      const result = await updateGateStatus(teamIndex, updates.status, updates.score, updates.gl);
  
      // Update frontend state based on backend response
      setGate((prevGate) => ({
        ...prevGate,
        ...result.gate, // Ensure latest values are used
      }));
  
      setMessage(result.message);
    } catch (error) {
      console.error("Error updating gate status:", error);
      setMessage("Failed to update gate status");
    }
  };
  




  if (loading) {
    return (
      <div>
        <h1>Gate Admin Dashboard</h1>
        <p>Loading gate data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Gate Admin Dashboard</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Gate Admin Dashboard</h1>
      <h2>Gate: {gate.gateName}</h2>
      <h3>Gatelord: {gate.gatelord ? gate.gatelord : "None"}</h3>
      <h3>Highest Score: {getHighestScore()}</h3> {/* Highest score heading */}
      {message && <p>{message}</p>}
      { <p>Gatelord Duration: {gate.time/60000} minutes</p>}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Team Name</th>
            <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>Status</th>
            <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>Score</th>
            <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>Gatelord</th>
            <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gate.teams.map((team, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>{team.teamName}</td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: team.status === 1 ? "#c3e88d" : "#f07178",
                }}
                onClick={() => handleStatusUpdate(index, { status: team.status === 0 ? 1 : 0 })}
              >
                {team.status === 1 ? "1" : "0"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>
                {editableIndex === index ? (
                  <input
                    type="number"
                    value={tempScore !== null ? tempScore : team.score}
                    onChange={(e) => setTempScore(Number(e.target.value))}
                    style={{ width: "60px", textAlign: "center" }}
                  />
                ) : (
                  team.score
                )}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>
                {gate.gatelord === team.teamName ? "✅" : "❌"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {editableIndex === index ? (
                  <button
                    style={{
                      padding: "5px 10px",
                      background: "#28A745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleStatusUpdate(index, { score: tempScore });
                      setEditableIndex(null);
                      setTempScore(null);
                    }}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    style={{
                      padding: "5px 10px",
                      background: "#007BFF",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setEditableIndex(index);
                      setTempScore(team.score);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  style={{
                    padding: "5px 10px",
                    background: "#FFA500",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                  onClick={team.status === 1 ? () => handleStatusUpdate(index, { gl: true }) : undefined}
    disabled={team.status !== 1} // Disables the button if status is not 1
                >
                  Set as Gatelord
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GateAdminDashboard;
