// api.js
import axios from 'axios';
import {Backend_Server} from '../port';
const API_URL = `${Backend_Server}/api/gates`;  // Adjust if your API is hosted on a different URL
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, // timeout in ms
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // Get the token from local storage
    }
  });

// Helper function to get the auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Function to fetch the assigned gate for the logged-in user
export const fetchAssignedGate = async () => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/assigned-gate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Response:', response); 
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch assigned gate.');
    }
     const data = await response.json();
    console.log('Gate Data:', data); // Log the returned data
    return data;
    
  } catch (error) {
    throw error;  // Forward the error to the calling function
  }
};

// Function to update the status and score of a team
// Function to update the status and score of a team
export const updateGateStatus = async (teamIndex, status, score, gl) => {
    try {
      const response = await api.put('/update-status', {
        teamIndex,
        status,
        score,
        gl
      });
      return response.data;
    } catch (error) {
      console.error('Error updating gate status:', error.response?.data || error.message);
      throw error;
    }
  };
  

// Function to assign a gate admin (Superadmin only)
export const assignGateAdmin = async (gateName, username) => {
    try {
      const response = await api.post("/assign-admin", {
        gateName,
        username,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };
