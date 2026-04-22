import api from "./api";

export const getActivitiesMap = () =>
  api.get("/activities-map/");



// =========================
// CAMPAIGNS
// =========================
export const getCampaigns = () => api.get("/campaigns/");

export const getCampaign = (id) =>
  api.get(`/campaigns/${id}/`);

export const createCampaign = (data) =>
  api.post("/campaigns/", data);

export const updateCampaign = (id, data) =>
  api.put(`/campaigns/${id}/`, data);

export const deleteCampaign = (id) =>
  api.delete(`/campaigns/${id}/`);


// =========================
// ACTIVITIES
// =========================
export const getActivities = () =>
  api.get("/activities/");

export const createActivity = (data) =>
  api.post("/activities/", data);

export const getCampaignActivities = (id) =>
  api.get(`/campaigns/${id}/activities/`);

export const applyToActivity = (activityId, data) =>
  api.post(`/activities/${activityId}/apply/`, data);

// =========================
// LOCATIONS
// =========================
export const createLocation = (data) =>
  api.post("/locations/", data);

export const deleteLocation = (id) =>
  api.delete(`/locations/${id}/`);