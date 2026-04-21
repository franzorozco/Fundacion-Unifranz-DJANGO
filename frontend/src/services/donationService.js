import axios from "./api";

export const createDonation = (data) => {
  return axios.post("/donations/", data);
};