import axios from "../axios";

const createNewPurchaseService = (data) => {
  return axios.post("/api/create-new-purchase", data);
};

const createNewPurchaseDetailService = (data) => {
  return axios.post("/api/create-new-purchase-detail", data);
};

const getAllPurchases = (inputid) => {
  return axios.get(`/api/get-all-purchase?id=${inputid}`);
};

const editPurchaseAndDetailsService = (inputdata) => {
  return axios.put("/api/edit-purchase-and-details", inputdata);
};
const deletePurchaseService = (purchaseid) => {
  return axios.delete("/api/delete-purchase", {
    data: {
      id: purchaseid,
    },
  });
};
export {
  createNewPurchaseService,
  createNewPurchaseDetailService,
  getAllPurchases,
  editPurchaseAndDetailsService,
  deletePurchaseService
};
