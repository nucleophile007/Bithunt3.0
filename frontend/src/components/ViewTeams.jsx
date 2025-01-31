import React, { useEffect, useState } from "react";
import axios from "axios";
import { Backend_Server } from "../port";
import { jsPDF } from "jspdf";

const ViewTeams = () => {
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGateDetails = async () => {
      try {
        const response = await axios.get(`${Backend_Server}/api/gates/gates-details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setGates(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching gate details");
      } finally {
        setLoading(false);
      }
    };

    fetchGateDetails();
    const interval = setInterval(fetchGateDetails, 1000);
    return () => clearInterval(interval);
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Total Team Scores", 20, 20);
    let y = 40;
    let pageHeight = doc.internal.pageSize.height;
    const lineHeight = 10;

    const teamScores = {};

    gates.forEach((gate) => {
      gate.teams?.forEach((team) => {
        teamScores[team.teamName] = (teamScores[team.teamName] || 0) + (team.score || 0);
      });
    });

    Object.entries(teamScores).forEach(([teamName, score], index) => {
      if (y + lineHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${teamName}: ${score} points`, 20, y);
      y += lineHeight;
    });

    doc.save("Total_Team_Scores.pdf");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-28">
      <div className="relative w-screen h-[150px] overflow-hidden">
        <div className="relative bottom-5 w-full whitespace-nowrap animate-marquee">
          <h1 className="text-9xl font-bold text-purple-900 tracking-wide inline-block">
          ⚠️ WAR ROOM ⚠️ &nbsp; ⚠️ WAR ROOM ⚠️ &nbsp; ⚠️ WAR ROOM ⚠️ &nbsp;⚠️ WAR ROOM ⚠️ &nbsp; ⚠️ WAR ROOM ⚠️ 
          </h1>
        </div>
      </div>
      <style>{`
  @keyframes marquee {
    from { transform: translateX(100vw); } /* Start fully off-screen */
    to { transform: translateX(-100%); } /* Move completely out */
  }
  .animate-marquee {
    display: inline-block;
    animation: marquee 10s linear infinite;
  }
  @keyframes blink {
    0% { background-color: purple; }
    50% { background-color: transparent; }
    100% { background-color: purple; }
  }
`}</style>

      <div className="space-y-6">
        {Array.isArray(gates) && gates.length > 0 ? (
          gates.map((gate) => (
            <div key={gate._id} className="w-screen min-w-full border p-4 rounded shadow space-y-4 py-20">
              <div className="text-5xl font-bold text-center">{gate.gateName}</div>
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))" }}
              >
                {Array.isArray(gate.teams) && gate.teams.length > 0 ? (
                  gate.teams.map((team) => (
                    <div key={team._id} className="flex flex-col items-center space-y-3">
                      <div
                        className="flex items-center justify-center rounded-full text-white font-bold "
                        style={{
                          backgroundColor: team.status === 1 
                            ? gate.gatelord === team.teamName 
                              ? "purple" 
                              : "green" 
                            : "red",
                          height: "150px",
                          width: "150px",
                          fontSize: "64px",
                          animation: gate.gatelord === team.teamName ? "blink 1s infinite" : "none",
                        }}
                      >
                        {/* <center style={{paddingBottom: "5px"}}> */}
                        {gate.gatelord === team.teamName ? "👑" : ""}{team.score}
                        {/* </center> */}

                      </div>
                      <div className="text-center text-4xl font-medium">
                        {team.teamName || "Unnamed"}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center text-sm">No teams assigned to this gate.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-sm">No gates available to display.</p>
        )}
      </div>
      <button
        onClick={generatePDF}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
  );
};

export default ViewTeams;