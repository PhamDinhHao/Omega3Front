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
const deleteStockService = (stockId) => {
  return axios.delete("/api/delete-stock-check", {
    data: {
      id: stockId,
    },
  });
};
export {
  createNewStockCheckService,
  createNewStockCheckDetailService,
  getAllStockChecks,
  deleteStockService
};
