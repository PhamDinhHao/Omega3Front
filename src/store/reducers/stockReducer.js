import actionTypes from "../actions/actionTypes";

const initialState = {
  stockChecks: [],
  stockCheckId: null,
};

const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_STOCK_CHECKS_SUCCESS:
      return {
        ...state,
        stockChecks: action.payload.stockChecks,
      };
    case actionTypes.FETCH_ALL_STOCK_CHECKS_FAILED:
      return {
        ...state,
        stockChecks: [],
      };
    case actionTypes.CREATE_STOCK_CHECK_SUCCESS:
      return {
        ...state,
        stockCheckId: action.payload.stockCheckId,
      };
    case actionTypes.CREATE_STOCK_CHECK_FAILED:
      return {
        ...state,
        stockCheckId: null,
      };
    case actionTypes.CREATE_STOCK_CHECK_DETAIL_SUCCESS:
      return {
        ...state,
      };
    case actionTypes.CREATE_STOCK_CHECK_DETAIL_FAILED:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default stockReducer;
