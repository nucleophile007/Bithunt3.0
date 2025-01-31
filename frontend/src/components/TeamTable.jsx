import React from 'react';

const TeamTable = ({ teams, onUpdate }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Team Name</th>
          <th>Status</th>
          <th>Score</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team, index) => (
          <tr key={index}>
            <td>{team.teamName}</td>
            <td>{team.status}</td>
            <td>{team.score}</td>
            <td>
              <button
                onClick={() => onUpdate(index, { status: team.status === 0 ? 1 : 0 })}
              >
                Toggle Status
              </button>
              <button
                onClick={() => {
                  const newScore = prompt('Enter new score:', team.score);
                  if (newScore) onUpdate(index, { score: parseInt(newScore, 10) });
                }}
              >
                Update Score
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamTable;
