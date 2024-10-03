import axios from "../axios";
const getAllCategory = (inputid) => {
    return axios.get(`/api/get-all-category?id=${inputid}`);
};

const createNewCategoryrService = (data) => {
    return axios.post("/api/create-new-category", data);
};
const getAllLocation = (inputid) => {
    return axios.get(`/api/get-all-location?id=${inputid}`);
};

const createNewLocationrService = (data) => {
    return axios.post("/api/create-new-location", data);
};


export {
    getAllCategory,
    createNewCategoryrService,
    getAllLocation, createNewLocationrService
};
