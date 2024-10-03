import axios from "../axios";
const getAllSupplier = (inputid) => {
  return axios.get(`/api/get-all-supplier?id=${inputid}`);
};
const deleteSupplierService = (supplierid) => {
  return axios.delete("/api/delete-supplier", {
    data: {
      id: supplierid,
    },
  });
};
const createNewSupplierService = (data) => {
  return axios.post("/api/create-new-supplier", data);
};
const editSupplierService = (inputdata) => {
  return axios.put("/api/edit-supplier", inputdata);
};

const getSupplierSuggestionsService = (inputdata) => {
  return axios.get("/api/get-supplier-suggestion", { params: inputdata });
};

export {
  getAllSupplier,
  deleteSupplierService,
  createNewSupplierService,
  editSupplierService,
  getSupplierSuggestionsService,
};
