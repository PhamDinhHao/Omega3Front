import actionTypes from "./actionTypes";
import {
    createNewSaleService,
    createNewSaleDetailService,
    getAllSales,
    editSaleAndDetailsService,
} from "../../services/saleService";
import { toast } from 'react-toastify';
export const createNewSale = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewSaleService(data);

            if (res && res.errCode === 0) {
                dispatch(saveSaleSuccess(res.saleId));
            } else {
                dispatch(saveSaleFailed());
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export const saveSaleSuccess = (saleId) => ({
    type: actionTypes.CREATE_SALE_SUCCESS,
    payload: { saleId },
});

export const saveSaleFailed = (error) => ({
    type: actionTypes.CREATE_SALE_FAILED,
    payload: { error },
});

export const createNewSaleDetail = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewSaleDetailService(data);
            if (res && res.errCode === 0) {
                dispatch(saveSaleDetailSuccess());
            } else {
                toast.error("Số lượng không đủ")
                dispatch(saveSaleDetailFailed());
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export const saveSaleDetailSuccess = () => ({
    type: actionTypes.CREATE_SALE_DETAIL_SUCCESS,
});

export const saveSaleDetailFailed = (error) => ({
    type: actionTypes.CREATE_SALE_DETAIL_FAILED,
    payload: { error },
});
export const fetchAllSalesStart = (inputId) => {
    return async (dispatch, getState) => {
        try {
            if (!inputId) {
                let res = await getAllSales("ALL");

                if (res && res.errCode === 0) {
                    dispatch(fetchAllSalesSuccess(res.Sales.reverse())); ///reverse giup dao nguoc mang
                } else {
                    // toast.success("Fetch all Suppplier error")
                    dispatch(fetchAllSalesFailed());
                }
            } else {
                let res = await getAllSales(inputId);
                if (res && res.errCode === 0) {
                    dispatch(fetchAllSalesSuccess(res.Sales.reverse())); ///reverse giup dao nguoc mang
                } else {
                    // toast.success("Fetch all Suppplier error")
                    dispatch(fetchAllSalesFailed());
                }
            }
        } catch (error) {
            // toast.success("Fetch all Suppplier error")
            dispatch(fetchAllSalesFailed());
            console.log(error);
        }
    };
};

export const fetchAllSalesSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_SALES_SUCCESS,
    payload: { Sales: data },
});

export const fetchAllSalesFailed = () => ({
    type: actionTypes.FETCH_ALL_SALES_FAILED,
});

export const editSaleAndDetails = (Sale, SaleDetails) => {
    return async (dispatch, getState) => {
        // console.log(
        //   "editSaleAndDetails called with:",
        //   Sale,
        //   SaleDetails
        // );
        try {
            let res = await editSaleAndDetailsService({
                Sale,
                SaleDetails,
            });
            // console.log("purdet", res);
            if (res && res.errCode === 0) {
                // toast.success("update user success") //thu vien toastify
                dispatch(editSaleAndDetailsSuccess());
            } else {
                // toast.success("Edit  user error")
                dispatch(editSaleAndDetailsFailed());
            }
        } catch (error) {
            // toast.success("Edituser error")
            dispatch(editSaleAndDetailsFailed());
            console.log("error", error);
        }
    };
};

export const editSaleAndDetailsSuccess = () => ({
    type: actionTypes.EDIT_SALE_AND_DETAILS_SUCCESS,
});

export const editSaleAndDetailsFailed = () => ({
    type: actionTypes.EDIT_SALE_AND_DETAILS_FAILDED,
});
