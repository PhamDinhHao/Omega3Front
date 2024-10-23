import axios from "../axios";

const createNewSaleService = (data) => {
    return axios.post("/api/create-new-sale", data);
};

const createNewSaleDetailService = (data) => {
    return axios.post("/api/create-new-sale-detail", data);
};
const getAllSales = (inputid) => {
    return axios.get(`/api/get-all-sale?id=${inputid}`);
};

const editSaleAndDetailsService = (inputdata) => {
    console.log("check input", inputdata);
    return axios.put("/api/edit-sale-and-details", inputdata);
};
const deleteSaleService = (saleid) => {
    return axios.delete("/api/delete-sale", {
      data: {
        id: saleid,
      },
    });
  };
export { createNewSaleService, createNewSaleDetailService, getAllSales, editSaleAndDetailsService, deleteSaleService };