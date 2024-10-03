import actionTypes from "./actionTypes";
import {
  createNewStockCheckService,
  createNewStockCheckDetailService,
  getAllStockChecks,
} from "../../services/stockService";

export const createNewStockCheck = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewStockCheckService(data);
      console.log("id", res.stockCheckId);
      console.log("data", res);
      if (res && res.errCode === 0) {
        dispatch(saveStockCheckSuccess(res.stockCheckId));
      } else {
        dispatch(saveStockCheckFailed());
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const saveStockCheckSuccess = (stockCheckId) => ({
  type: actionTypes.CREATE_STOCK_CHECK_SUCCESS,
  payload: { stockCheckId },
});

export const saveStockCheckFailed = (error) => ({
  type: actionTypes.CREATE_STOCK_CHECK_FAILED,
  payload: { error },
});

export const createNewStockCheckDetail = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewStockCheckDetailService(data);
      if (res && res.errCode === 0) {
        dispatch(saveStockCheckDetailSuccess());
      } else {
        dispatch(saveStockCheckDetailFailed());
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const saveStockCheckDetailSuccess = () => ({
  type: actionTypes.CREATE_STOCK_CHECK_DETAIL_SUCCESS,
});

export const saveStockCheckDetailFailed = (error) => ({
  type: actionTypes.CREATE_STOCK_CHECK_DETAIL_FAILED,
  payload: { error },
});

export const fetchAllStockChecksStart = (inputId) => {
  return async (dispatch, getState) => {
    try {
      if (!inputId) {
        let res = await getAllStockChecks("ALL");
        console.log("sto", res);
        if (res && res.errCode === 0) {
          dispatch(fetchAllStockChecksSuccess(res.stockChecks.reverse())); ///reverse giup dao nguoc mang
        } else {
          // toast.success("Fetch all Suppplier error")
          dispatch(fetchAllStockChecksFailed());
        }
      } else {
        let res = await getAllStockChecks(inputId);
        if (res && res.errCode === 0) {
          dispatch(fetchAllStockChecksSuccess(res.stockChecks.reverse())); ///reverse giup dao nguoc mang
        } else {
          // toast.success("Fetch all Suppplier error")
          dispatch(fetchAllStockChecksFailed());
        }
      }
    } catch (error) {
      // toast.success("Fetch all Suppplier error")
      dispatch(fetchAllStockChecksFailed());
      console.log(error);
    }
  };
};

export const fetchAllStockChecksSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_STOCK_CHECKS_SUCCESS,
  payload: { stockChecks: data },
});

export const fetchAllStockChecksFailed = () => ({
  type: actionTypes.FETCH_ALL_STOCK_CHECKS_FAILED,
});
