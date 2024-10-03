import actionTypes from "./actionTypes";
import {
  getAllProducts,
  createNewProductService,
  deleteProductService,
  editProductService,
  getProductSuggestionsService,
  getProductByPurchaseIdService,
  getProductBySaleIdService,
} from "../../services/productService";

export const fetchAllProductsStart = (inputId) => {
  return async (dispatch, getState) => {
    try {
      if (!inputId) {
        let res = await getAllProducts("ALL");

        if (res && res.errCode === 0) {
          dispatch(fetchAllProductsSuccess(res.products.reverse())); ///reverse giup dao nguoc mang
        } else {
          // toast.success("Fetch all Suppplier error")
          dispatch(fetchAllProductsFailed());
        }
      } else {
        let res = await getAllProducts(inputId);
        if (res && res.errCode === 0) {
          dispatch(fetchAllProductsSuccess(res.products.reverse())); ///reverse giup dao nguoc mang
        } else {
          // toast.success("Fetch all Suppplier error")
          dispatch(fetchAllProductsFailed());
        }
      }
    } catch (error) {
      // toast.success("Fetch all Suppplier error")
      dispatch(fetchAllProductsFailed());
      console.log(error);
    }
  };
};

export const fetchAllProductsSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_PRODUCTS_SUCCESS,
  products: data,
});
export const fetchAllProductsFailed = () => ({
  type: actionTypes.FETCH_ALL_PRODUCTS_FAILED,
});

export const createNewProduct = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewProductService(data);

      if (res && res.errCode === 0) {
        // toast.success("Create a new user success") //thu vien toastify
        dispatch(saveProductSuccess());
        dispatch(fetchAllProductsStart());
      } else {
        // toast.success("Create a new user arror")
        dispatch(saveProductFailed());
      }
    } catch (error) {
      // toast.success("Create a new user arror")
      console.log(error);
    }
  };
};
export const saveProductSuccess = () => ({
  type: actionTypes.CREATE_PRODUCT_SUCCESS,
});
export const saveProductFailed = () => ({
  type: actionTypes.CREATE_PRODUCT_FAILDED,
});

export const deleteProduct = (productid) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteProductService(productid);

      if (res && res.errCode === 0) {
        // toast.success("delete a new user success") //thu vien toastify
        dispatch(deleteProductSuccess());
        dispatch(fetchAllProductsStart());
      } else {
        // toast.success("delete a new Supplier error")
        dispatch(deleteProductFailed());
      }
    } catch (error) {
      // toast.success("delete a new Supplier error")
      dispatch(deleteProductFailed());
      console.log("error", error);
    }
  };
};
export const deleteProductSuccess = () => ({
  type: actionTypes.DELETE_PRODUCT_SUCCESS,
});
export const deleteProductFailed = () => ({
  type: actionTypes.DELETE_PRODUCT_FAILDED,
});

export const editProduct = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await editProductService(data);

      if (res && res.errCode === 0) {
        // toast.success("update user success") //thu vien toastify
        dispatch(editProductSuccess());
        dispatch(fetchAllProductsStart());
      } else {
        // toast.success("Edit  user error")
        dispatch(editProductFailed());
      }
    } catch (error) {
      // toast.success("Edituser error")
      dispatch(editProductFailed());
      console.log("error", error);
    }
  };
};
export const editProductSuccess = () => ({
  type: actionTypes.EDIT_PRODUCT_SUCCESS,
});
export const editProductFailed = () => ({
  type: actionTypes.EDIT_PRODUCT_FAILDED,
});

export const fetchProductSuggestions = (value) => {
  return async (dispatch, getState) => {
    dispatch(fetchProductSuggestionsRequest());
    try {
      const response = await getProductSuggestionsService({ q: value });

      const data = response.suggestions;

      dispatch(fetchProductSuggestionsSuccess(data));
    } catch (error) {
      dispatch(fetchProductSuggestionsFailure(error.message));
    }
  };
};

export const fetchProductSuggestionsRequest = () => ({
  type: actionTypes.FETCH_PRODUCT_SUGGESTIONS_REQUEST,
});

export const fetchProductSuggestionsSuccess = (suggestions) => ({
  type: actionTypes.FETCH_PRODUCT_SUGGESTIONS_SUCCESS,
  payload: suggestions,
});

export const fetchProductSuggestionsFailure = (error) => ({
  type: actionTypes.FETCH_PRODUCT_SUGGESTIONS_FAILURE,
  payload: error,
});

export const fetchProductByPurchaseIdRedux = (purchaseId) => {
  return async (dispatch, getState) => {
    try {
      let res = await getProductByPurchaseIdService(purchaseId);
      // console.log("products by purchaseId", res);
      if (res && res.errCode === 0) {
        dispatch(fetchProductByPurchaseIdSuccess(res.data));
      } else {
        dispatch(fetchProductByPurchaseIdFailed());
      }
    } catch (error) {
      console.log("Error fetching purchase detail:", error);
      dispatch(fetchProductByPurchaseIdFailed());
    }
  };
};

export const fetchProductByPurchaseIdSuccess = (data) => ({
  type: actionTypes.FETCH_PRODUCT_BY_PURCHASEID_SUCCESS,
  payload: { listProductByPurchaseId: data },
});

export const fetchProductByPurchaseIdFailed = () => ({
  type: actionTypes.FETCH_PRODUCT_BY_PURCHASEID_FAILED,
});

export const fetchProductBySaleIdRedux = (saleId) => {
  return async (dispatch, getState) => {
    try {
      let res = await getProductBySaleIdService(saleId);
      // console.log("products by purchaseId", res);
      if (res && res.errCode === 0) {
        dispatch(fetchProductBySaleIdSuccess(res.data));
      } else {
        dispatch(fetchProductBySaleIdFailed());
      }
    } catch (error) {
      console.log("Error fetching Sale detail:", error);
      dispatch(fetchProductBySaleIdFailed());
    }
  };
};

export const fetchProductBySaleIdSuccess = (data) => ({
  type: actionTypes.FETCH_PRODUCT_BY_SALEID_SUCCESS,
  payload: { listProductBySaleId: data },
});

export const fetchProductBySaleIdFailed = () => ({
  type: actionTypes.FETCH_PRODUCT_BY_SALEID_FAILED,
});