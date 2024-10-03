import actionTypes from "./actionTypes";
import {
  getAllSupplier,
  deleteSupplierService,
  createNewSupplierService,
  editSupplierService,
  getSupplierSuggestionsService,
} from "../../services/supplierService";

export const fetchAllSuppliersStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllSupplier("ALL");
      console.log("res", res);
      if (res && res.errCode === 0) {
        dispatch(fetchAllSuppliersSucces(res.suppliers.reverse())); ///reverse giup dao nguoc mang
      } else {
        // toast.success("Fetch all Suppplier error")
        dispatch(fetchAllSuppliersFailed());
      }
    } catch (error) {
      // toast.success("Fetch all Suppplier error")
      dispatch(fetchAllSuppliersFailed());
      console.log(error);
    }
  };
};
export const fetchAllSuppliersSucces = (data) => ({
  type: actionTypes.FETCH_ALL_Supplier_SUCCESS,
  suppliers: data,
});
export const fetchAllSuppliersFailed = () => ({
  type: actionTypes.FETCH_ALL_Supplier_FAILED,
});
export const deleteSupplier = (supplierid) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteSupplierService(supplierid);

      if (res && res.errCode === 0) {
        // toast.success("delete a new user success") //thu vien toastify
        dispatch(deleteSupplierSuccess());
        dispatch(fetchAllSuppliersStart());
      } else {
        // toast.success("delete a new Supplier error")
        dispatch(deleteSupplierFailed());
      }
    } catch (error) {
      // toast.success("delete a new Supplier error")
      dispatch(deleteSupplierFailed());
      console.log("error", error);
    }
  };
};
export const deleteSupplierSuccess = () => ({
  type: actionTypes.DELETE_SUPPLIER_SUCCESS,
});
export const deleteSupplierFailed = () => ({
  type: actionTypes.DELETE_SUPPLIERFAILDED,
});
export const createNewSupplier = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewSupplierService(data);

      if (res && res.errCode === 0) {
        // toast.success("Create a new user success") //thu vien toastify
        dispatch(saveSupplierSuccess());
        dispatch(fetchAllSuppliersStart());
      } else {
        // toast.success("Create a new user arror")
        dispatch(saveSupplierFailed());
      }
    } catch (error) {
      // toast.success("Create a new user arror")
      console.log(error);
    }
  };
};
export const saveSupplierSuccess = () => ({
  type: actionTypes.CREATE_SUPPLIER_SUCCESS,
});
export const saveSupplierFailed = () => ({
  type: actionTypes.CREATE_SUPPLIERFAILDED,
});
export const editSupplier = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await editSupplierService(data);

      if (res && res.errCode === 0) {
        // toast.success("update user success") //thu vien toastify
        dispatch(editSupplierSuccess());
        dispatch(fetchAllSuppliersStart());
      } else {
        // toast.success("Edit  user error")
        dispatch(editSupplierFailed());
      }
    } catch (error) {
      // toast.success("Edituser error")
      dispatch(editSupplierFailed());
      console.log("error", error);
    }
  };
};
export const editSupplierSuccess = () => ({
  type: actionTypes.EDIT_SUPPLIER_SUCCESS,
});
export const editSupplierFailed = () => ({
  type: actionTypes.EDIT_SUPPLIERFAILDED,
});

export const fetchSupplierSuggestions = (value) => {
  return async (dispatch, getState) => {
    dispatch(fetchSupplierSuggestionsRequest());
    try {
      const response = await getSupplierSuggestionsService({ q: value });
      // console.log("res", response);
      const data = response.suggestions;
      // console.log("data", data);
      dispatch(fetchSupplierSuggestionsSuccess(data));
    } catch (error) {
      dispatch(fetchSupplierSuggestionsFailure(error.message));
    }
  };
};

export const fetchSupplierSuggestionsRequest = () => ({
  type: actionTypes.FETCH_SUPPLIER_SUGGESTIONS_REQUEST,
});

export const fetchSupplierSuggestionsSuccess = (suggestions) => ({
  type: actionTypes.FETCH_SUPPLIER_SUGGESTIONS_SUCCESS,
  payload: suggestions,
});

export const fetchSupplierSuggestionsFailure = (error) => ({
  type: actionTypes.FETCH_SUPPLIER_SUGGESTIONS_FAILURE,
  payload: error,
});
