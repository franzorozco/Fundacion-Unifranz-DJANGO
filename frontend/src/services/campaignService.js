import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// =========================
// CAMPAIGNS
// =========================
export const getCampaigns = async () => {
  const token = localStorage.getItem("token");

  return await axios.get("http://127.0.0.1:8000/api/campaigns/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCampaign = async (id) => {
  return await axios.get(`${API_URL}/campaigns/${id}/`);
};

export const createCampaign = async (data, token) => {
  return await axios.post(`${API_URL}/campaigns/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCampaign = async (id, data, token) => {
  return await axios.put(`${API_URL}/campaigns/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCampaign = async (id, token) => {
  return await axios.delete(`${API_URL}/campaigns/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// =========================
// ACTIVITIES
// =========================
export const getActivities = async () => {
  return await axios.get(`${API_URL}/activities/`);
};

export const createActivity = async (data, token) => {
  return await axios.post(`${API_URL}/activities/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};