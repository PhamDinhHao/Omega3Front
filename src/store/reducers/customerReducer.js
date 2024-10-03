import actionTypes from "../actions/actionTypes";

const initialState = {
  customers: [],
  loading: false,
  error: null,
  customerSuggestions: [],
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_Customer_SUCCESS:
      state.customers = action.customers;
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_Customer_FAILED:
      state.customers = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_CUSTOMER_SUGGESTIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_CUSTOMER_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        customerSuggestions: action.payload,
      };
    case actionTypes.FETCH_CUSTOMER_SUGGESTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default customerReducer;