import actionTypes from "../actions/actionTypes";

const initialState = {
  products: [],
  listProductByPurchaseId: [],
  listProductBySaleId: [],
  loading: false,
  error: null,
  productSuggestions: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_PRODUCTS_SUCCESS:
      state.products = action.products;
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_PRODUCTS_FAILED:
      state.products = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_PRODUCT_SUGGESTIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_PRODUCT_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        productSuggestions: action.payload,
      };
    case actionTypes.FETCH_PRODUCT_SUGGESTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case actionTypes.FETCH_PRODUCT_BY_PURCHASEID_SUCCESS:
      return {
        ...state,
        listProductByPurchaseId: action.payload.listProductByPurchaseId,
        isLoading: false,
        error: null,
      };
    case actionTypes.FETCH_PRODUCT_BY_PURCHASEID_FAILED:
      return {
        ...state,
        isLoading: false,
        error: "Failed to fetch products by purchase ID",
      };
    case actionTypes.FETCH_PRODUCT_BY_SALEID_SUCCESS:
      return {
        ...state,
        listProductBySaleId: action.payload.listProductBySaleId,
        isLoading: false,
        error: null,
      };
    case actionTypes.FETCH_PRODUCT_BY_SALEID_FAILED:
      return {
        ...state,
        isLoading: false,
        error: "Failed to fetch products by sale ID",
      };
    default:
      return state;
  }
};

export default productReducer;
