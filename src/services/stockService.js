import axios from "../axios";

const createNewStockCheckService = (data) => {
  return axios.post("/api/create-new-stock-check", data);
};

const createNewStockCheckDetailService = (data) => {
  return axios.post("/api/create-new-stock-check-detail", data);
};

const getAllStockChecks = (inputid) => {
  return axios.get(`/api/get-all-stock-check?id=${inputid}`);
};

export {
  createNewStockCheckService,
  createNewStockCheckDetailService,
  getAllStockChecks,
};
