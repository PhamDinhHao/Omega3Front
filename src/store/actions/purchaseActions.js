import actionTypes from "./actionTypes";
import {
  createNewPurchaseService,
  createNewPurchaseDetailService,
  getAllPurchases,
  editPurchaseAndDetailsService,
} from "../../services/purchaseService";

export const createNewPurchase = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewPurchaseService(data);
      // console.log("id", res.purchaseId);
      if (res && res.errCode === 0) {
        dispatch(savePurchaseSuccess(res.purchaseId));
      } else {
        dispatch(savePurchaseFailed());
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const savePurchaseSuccess = (purchaseId) => ({
  type: actionTypes.CREATE_PURCHASE_SUCCESS,
  payload: { purchaseId },
});

export const savePurchaseFailed = (error) => ({
  type: actionTypes.CREATE_PURCHASE_FAILED,
  payload: { error },
});

export const createNewPurchaseDetail = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewPurchaseDetailService(data);
      if (res && res.errCode === 0) {
        dispatch(savePurchaseDetailSuccess());
      } else {
        dispatch(savePurchaseDetailFailed());
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const savePurchaseDetailSuccess = () => ({
  type: actionTypes.CREATE_PURCHASE_DETAIL_SUCCESS,
});

export const savePurchaseDetailFailed = (error) => ({
  type: actionTypes.CREATE_PURCHASE_DETAIL_FAILED,
  payload: { error },
});

// export const fetchAllPurchasesStart = (inputId) => {
//   return async (dispatch, getState) => {
//     try {
//       if (!inputId) {
//         let res = await getAllPurchases("ALL");

//         if (res && res.errCode === 0) {
//           dispatch(fetchAllPurchasesSuccess(res.products.reverse())); ///reverse giup dao nguoc mang
//         } else {
//           // toast.success("Fetch all Suppplier error")
//           dispatch(fetchAllPurchasesFailed());
//         }
//       } else {
//         let res = await getAllPurchases(inputId);
//         if (res && res.errCode === 0) {
//           dispatch(fetchAllPurchasesSuccess(res.products.reverse())); ///reverse giup dao nguoc mang
//         } else {
//           // toast.success("Fetch all Suppplier error")
//           dispatch(fetchAllPurchasesFailed());
//         }
//       }
//     } catch (error) {
//       // toast.success("Fetch all Suppplier error")
//       dispatch(fetchAllPurchasesFailed());
//       console.log(error);
//     }
//   };
// };

export const fetchAllPurchasesStart = (inputId) => {
  return async (dispatch, getState) => {
    try {
      if (!inputId) {
        let res = await getAllPurchases("ALL");
        console.log("pur", res);
        if (res && res.errCode === 0) {
          dispatch(fetchAllPurchasesSuccess(res.purchases.reverse())); ///reverse giup dao nguoc mang
        } else {
          // toast.success("Fetch all Suppplier error")
          dispatch(fetchAllPurchasesFailed());
        }
      } else {
        let res = await getAllPurchases(inputId);
        if (res && res.errCode === 0) {
          dispatch(fetchAllPurchasesSuccess(res.purchases.reverse())); ///reverse giup dao nguoc mang
        } else {
          // toast.success("Fetch all Suppplier error")
          dispatch(fetchAllPurchasesFailed());
        }
      }
    } catch (error) {
      // toast.success("Fetch all Suppplier error")
      dispatch(fetchAllPurchasesFailed());
      console.log(error);
    }
  };
};

export const fetchAllPurchasesSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_PURCHASES_SUCCESS,
  payload: { purchases: data },
});

export const fetchAllPurchasesFailed = () => ({
  type: actionTypes.FETCH_ALL_PURCHASES_FAILED,
});

export const editPurchaseAndDetails = (purchase, purchaseDetails) => {
  return async (dispatch, getState) => {
    // console.log(
    //   "editPurchaseAndDetails called with:",
    //   purchase,
    //   purchaseDetails
    // );
    try {
      let res = await editPurchaseAndDetailsService({
        purchase,
        purchaseDetails,
      });
      // console.log("purdet", res);
      if (res && res.errCode === 0) {
        // toast.success("update user success") //thu vien toastify
        dispatch(editPurchaseAndDetailsSuccess());
      } else {
        // toast.success("Edit  user error")
        dispatch(editPurchaseAndDetailsFailed());
      }
    } catch (error) {
      // toast.success("Edituser error")
      dispatch(editPurchaseAndDetailsFailed());
      console.log("error", error);
    }
  };
};

export const editPurchaseAndDetailsSuccess = () => ({
  type: actionTypes.EDIT_PURCHASE_AND_DETAILS_SUCCESS,
});

export const editPurchaseAndDetailsFailed = () => ({
  type: actionTypes.EDIT_PURCHASE_AND_DETAILS_FAILDED,
});
