import axios from "../axios";

const getAllProducts = (inputid) => {
  return axios.get(`/api/get-all-product?id=${inputid}`);
};

const createNewProductService = (data) => {
  return axios.post("/api/create-new-product", data);
};

const deleteProductService = (productid) => {
  return axios.delete("/api/delete-product", {
    data: {
      id: productid,
    },
  });
};

const editProductService = (inputdata) => {
  console.log("check input", inputdata);
  return axios.put("/api/edit-product", inputdata);
};

const getProductSuggestionsService = (inputdata) => {
  return axios.get("api/get-product-suggestion", { params: inputdata });
};

const getProductByPurchaseIdService = (purchaseId) => {
  return axios.get(`/api/get-product-by-purchaseid?purchaseId=${purchaseId}`);
};
const getProductBySaleIdService = (saleId) => {
  return axios.get(`/api/get-product-by-saleId?saleId=${saleId}`);
};
const getProductDoneSale = () => {
  return axios.get("/api/get-product-done-sale");
}

export {
  getAllProducts,
  createNewProductService,
  deleteProductService,
  editProductService,
  getProductSuggestionsService,
  getProductByPurchaseIdService,
  getProductDoneSale,
  getProductBySaleIdService
};
