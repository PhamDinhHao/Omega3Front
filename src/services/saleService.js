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
    return axios.put("/api/total-sales-by-day", inputdata);
};
export { createNewSaleService, createNewSaleDetailService, getAllSales, editSaleAndDetailsService };