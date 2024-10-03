import axios from "../axios";
const getAllHistorySale = () => {
    return axios.get(`http://localhost:8080/api/total-sales-by-day`);
};
const getAllHistorySaleMonth = () => {
    return axios.get(`http://localhost:8080/api/total-sales-by-mon`);
};
const getAllHistoryPurchase = () => {
    return axios.get(`http://localhost:8080/api/total-purchase-by-day`);
};
const getAllHistoryPurchaseMonth = () => {
    return axios.get(`http://localhost:8080/api/total-purchase-by-mon`);
};
export {
    getAllHistorySale,
    getAllHistoryPurchase,
    getAllHistorySaleMonth,
    getAllHistoryPurchaseMonth
};
