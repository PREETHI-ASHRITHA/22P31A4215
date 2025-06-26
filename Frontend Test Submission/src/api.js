import axios from 'axios';

const API_BASE = 'http://20.244.56.144/evaluation-service';

export const registerUser = async (data) => {
  const res = await axios.post(`${API_BASE}/register`, data);
  return res.data;
};

export const getToken = async (data) => {
  const res = await axios.post(`${API_BASE}/auth`, data);
  return res.data.access_token;
};

export const logMessage = async (logData) => {
  await axios.post(`${API_BASE}/log`, logData);
};
