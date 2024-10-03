import axios from "../axios";

const getTop10ProductBySale = async (
  filterType,
  selectedDate,
  startDate = null,
  endDate = null
) => {
  return axios.get(`http://localhost:8080/api/top-10-sale-product-revenue`, {
    params: {
      filterType,
      selectedDate,
      startDate,
      endDate,
    },
  });
};

const getTop10ProductByQuantity = async (
  filterType,
  selectedDate,
  startDate = null,
  endDate = null
) => {
  return axios.get(`http://localhost:8080/api/top-10-sale-product-quantity`, {
    params: {
      filterType,
      selectedDate,
      startDate,
      endDate,
    },
  });
};

const getTop10CustomersByRevenue = (
  filterType,
  selectedDate,
  startDate = null,
  endDate = null
) => {
  return axios.get("http://localhost:8080/api/top-10-customer-revenue", {
    params: { filterType, selectedDate, startDate, endDate },
  });
};

const getTop10SuppliersByRevenue = (
  filterType,
  selectedDate,
  startDate = null,
  endDate = null
) => {
  return axios.get("http://localhost:8080/api/top-10-supplier-revenue", {
    params: { filterType, selectedDate, startDate, endDate },
  });
};

export {
  getTop10ProductBySale,
  getTop10ProductByQuantity,
  getTop10CustomersByRevenue,
  getTop10SuppliersByRevenue,
};
