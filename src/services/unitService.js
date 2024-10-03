import axios from "../axios";
const getAllUnit = (inputid) => {
    return axios.get(`/api/get-all-unit?id=${inputid}`);
};

const createNewUnitService = (data) => {
    return axios.post("/api/create-new-unit", data);
};



export {
    getAllUnit,
    createNewUnitService,

};
