import axios from "../axios";
const getAllCustomer = (inputid) => {
  return axios.get(`/api/get-all-customer?id=${inputid}`);
};

const createNewCustomerService = (data) => {
  return axios.post("/api/create-new-customer", data);
};

const deleteCustomerService = (customerid) => {
  return axios.delete("/api/delete-customer", {
    data: {
      id: customerid,
    },
  });
};

const editCustomerService = (inputdata) => {
  return axios.put("/api/edit-customer", inputdata);
};
const getCustomerSuggestionsService = (inputdata) => {
  console.log("check customer", inputdata);
  return axios.get("/api/get-customer-suggestion", { params: inputdata });
};
export {
  getAllCustomer,
  createNewCustomerService,
  deleteCustomerService,
  editCustomerService,
  getCustomerSuggestionsService
};


