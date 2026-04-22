import axios from "./api";

export const createDonation = (data) => {
  return axios.post("/donations/", data);
};

export const getDonations = () => {
  return axios.get("/donations/all/");
};

export const updateDonationStatus = (id, status, description = "") => {
  return axios.patch(`/donations/${id}/status/`, {
    status,
    description,
  });
};