import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Get simulator status
 * @returns {Promise} Promise with status data
 */
export const getStatus = async () => {
  try {
    const response = await api.get('/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching status:', error);
    throw error;
  }
};

/**
 * Start the simulation
 * @returns {Promise} Promise with response data
 */
export const startSimulation = async () => {
  try {
    const response = await api.post('/simulation/start');
    return response.data;
  } catch (error) {
    console.error('Error starting simulation:', error);
    throw error;
  }
};

/**
 * Stop the simulation
 * @returns {Promise} Promise with response data
 */
export const stopSimulation = async () => {
  try {
    const response = await api.post('/simulation/stop');
    return response.data;
  } catch (error) {
    console.error('Error stopping simulation:', error);
    throw error;
  }
};

/**
 * Update simulation settings
 * @param {Object} settings - Settings to update
 * @returns {Promise} Promise with response data
 */
export const updateSettings = async (settings) => {
  try {
    const response = await api.post('/simulation/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

/**
 * Set manual control values
 * @param {Object} values - Sensor values to set
 * @param {boolean} enabled - Whether manual mode is enabled
 * @returns {Promise} Promise with response data
 */
export const setManualControl = async (values, enabled = true) => {
  try {
    const response = await api.post('/simulation/manual', { values, enabled });
    return response.data;
  } catch (error) {
    console.error('Error setting manual control:', error);
    throw error;
  }
};

/**
 * Resume automatic simulation (disable manual mode)
 * @returns {Promise} Promise with response data
 */
export const resumeAutomatic = async () => {
  try {
    const response = await api.post('/simulation/manual', { enabled: false });
    return response.data;
  } catch (error) {
    console.error('Error resuming automatic mode:', error);
    throw error;
  }
};

/**
 * Reset simulation to default settings
 * @returns {Promise} Promise with response data
 */
export const resetSimulation = async () => {
  try {
    const response = await api.post('/simulation/reset');
    return response.data;
  } catch (error) {
    console.error('Error resetting simulation:', error);
    throw error;
  }
}; 