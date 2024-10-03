import actionTypes from "../actions/actionTypes";

const initialState = {
  suppliers: [],
  loading: false,
  error: null,
  supplierSuggestions: [],
};

const supplierReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_Supplier_SUCCESS:
      state.suppliers = action.suppliers;
      return {
        ...state,
      };
    case actionTypes.DELETE_SUPPLIERFAILDED:
      state.suppliers = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_SUPPLIER_SUGGESTIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_SUPPLIER_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        supplierSuggestions: action.payload,
      };
    case actionTypes.FETCH_SUPPLIER_SUGGESTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default supplierReducer;
