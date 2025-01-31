import Gate from '../models/Gate.js';
import User from '../models/User.js';

// Register multiple gates
export const registerGates = async (req, res) => {
  try {
    const { numGates, numTeams, timeInMinutes } = req.body; // Accept timeInMinutes

    // Ensure only superadmin can create gates
    const superAdmin = await User.findById(req.userId);
    if (!superAdmin || superAdmin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can register gates' });
    }

    // Convert time in minutes to milliseconds
    const timeInMilliseconds = timeInMinutes * 60000; // 1 minute = 60000 milliseconds

    // Create a common list of teams
    const teams = [];
    for (let i = 1; i <= numTeams; i++) {
      teams.push({
        teamName: `Team ${i}`,
        status: 0,
        score: 0,
      });
    }

    // Register gates with the same set of teams and added time
    for (let i = 0; i < numGates; i++) {
      const newGate = new Gate({
        gateName: `Gate ${String.fromCharCode(65 + i)}`, // Gate A, Gate B, etc.
        teams: teams, // Assign the same list of teams to each gate
        time: timeInMilliseconds, // Store the time in milliseconds
      });

      await newGate.save();
    }

    res.status(201).json({ message: `${numGates} gates registered successfully with ${numTeams} teams at each gate.` });
  } catch (error) {
    res.status(500).json({ message: 'Error registering gates', error: error.message });
  }
};

  

// Update gate status and score
export const updateGateStatus = async (req, res) => {
  try {
    const { teamIndex, status, score, gl } = req.body;

    // Find the logged-in user (gate admin)
    const gateAdmin = await User.findById(req.userId);
    if (!gateAdmin) {
      return res.status(403).json({ message: 'Invalid user. Please log in again.' });
    }

    // Check if the gate admin is assigned to any gate
    const gate = await Gate.findOne({ gateAdmin: gateAdmin._id });
    if (!gate) {
      return res.status(403).json({ message: 'You are not assigned to any gate.' });
    }

    // Validate the teamIndex
    if (teamIndex < 0 || teamIndex >= gate.teams.length) {
      return res.status(404).json({ message: 'Invalid team index.' });
    }

    // Update the team's status and score
    const team = gate.teams[teamIndex];
    if (status !== undefined) {
      if (status !== 0 && status !== 1) {
        return res.status(400).json({ message: 'Invalid status. Use 0 or 1.' });
      }
      team.status = status;
    }
    if (score !== undefined) {
      if (typeof score !== 'number' ) {
        return res.status(400).json({ message: 'Score must be a non-negative number.' });
      }
      team.score = score;
    }

    // Handle gatelord assignment
    if (gl !== undefined) {
      if (gl === true) {
          // Set the current team as Gatelord
          gate.gatelord = team.teamName;
  
          // Clear any existing timeout before setting a new one
          if (gate.timeoutId) {
              clearTimeout(gate.timeoutId);
          }
  
          // Automatically reset Gatelord after `gate.time` duration
          gate.timeoutId = setTimeout(async () => {
              console.log(`Gatelord timeout reached. Removing Gatelord for team: ${team.teamName}`);
  
              // Ensure it’s still the same team before removing
              const latestGate = await Gate.findById(gate._id);
              if (latestGate.gatelord === team.teamName) {
                  latestGate.gatelord = null;
                  await latestGate.save();
              }
          }, gate.time || 300000); // Default to 5 minutes if `gate.time` is undefined
      } else {
          // Remove the Gatelord assignment immediately
          gate.gatelord = null;
  
          // Clear any existing timeout
          if (gate.timeoutId) {
              clearTimeout(gate.timeoutId);
              gate.timeoutId = null;
          }
      }
  }
  
  // Mark the `teams` array as modified
  gate.markModified('teams');
  

    // Save the updated gate
    await gate.save();

    res.status(200).json({
      message: 'Team status, score, and gatelord updated successfully.',
      gate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating gate', error: error.message });
  }
};

  
  

export const assignGateAdmin = async (req, res) => {
    try {
      const { gateName, username } = req.body;
  
      // Ensure only superadmin can assign gate admins
      const superAdmin = await User.findById(req.userId);
      if (!superAdmin || superAdmin.role !== 'superadmin') {
        return res.status(403).json({ message: 'Only superadmin can assign gate admins' });
      }
  
      // Find the gate by its name
      const gate = await Gate.findOne({ gateName });
      if (!gate) {
        return res.status(404).json({ message: `Gate ${gateName} not found.` });
      }
  
      // Find the user by their username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: `User ${username} not found.` });
      }
  
      // Ensure the user is not already assigned as a gateAdmin for another gate
      const existingGate = await Gate.findOne({ gateAdmin: user._id });
      if (existingGate) {
        return res.status(400).json({
          message: `User ${username} is already assigned to gate ${existingGate.gateName}.`,
        });
      }
  
      // Assign the user as the gateAdmin
      gate.gateAdmin = user._id;
      await gate.save();
  
      res.status(200).json({ message: `User ${username} assigned as admin for ${gateName}.` });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning gate admin', error: error.message });
    }
  };

  // In gateController.js

// Fetch the assigned gate for the logged-in user
export const getAssignedGate = async (req, res) => {
    try {
      // Find the logged-in user
      const gateAdmin = await User.findById(req.userId);
      if (!gateAdmin) {
        return res.status(403).json({ message: 'Invalid user. Please log in again.' });
      }
  
      // Find the gate that this user is assigned to
      const gate = await Gate.findOne({ gateAdmin: gateAdmin._id });
      if (!gate) {
        return res.status(404).json({ message: 'You are not assigned to any gate.' });
      }
  
      // Return the gate details
      res.status(200).json({ gate });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching assigned gate', error: error.message });
    }
  };

  export const deleteAllGates = async (req, res) => {
    try {
      // Ensure only superadmin can delete all gates
      const superAdmin = await User.findById(req.userId);
      if (!superAdmin || superAdmin.role !== 'superadmin') {
        return res.status(403).json({ message: 'Only superadmin can delete all gates' });
      }
  
      // Delete all gates from the database
      await Gate.deleteMany();
  
      res.status(200).json({ message: 'All gates deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting all gates', error: error.message });
    }
  };

  // Get all gates
export const getAllGates = async (req, res) => {
  try {
    const gates = await Gate.find({}, "gateName"); // Fetch only gate names
    res.status(200).json({ gates });
  } catch (error) {
    res.status(500).json({ message: "Error fetching gates", error: error.message });
  }
};

  
