import api from "./api";

export const getApplications = () => api.get("/activity-volunteers/");
export const updateApplication = (id, data) =>
  api.put(`/activity-volunteers/${id}/`, data);