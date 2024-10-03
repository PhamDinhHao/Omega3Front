import actionTypes from "../actions/actionTypes";

const initialState = {
    sales: [],
    saleId: null,
    loading: false,
    error: null,
    isSaleDetail: false
};

const saleReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_SALE_SUCCESS:
            return {
                ...state,
                saleId: action.payload.saleId,
                loading: false,
                error: null,
            };
        case actionTypes.CREATE_SALE_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        case actionTypes.FETCH_ALL_SALES_SUCCESS:
            return {
                ...state,
                sales: action.payload.Sales,
                loading: false,
                error: null,
            };
        case actionTypes.FETCH_ALL_SALES_FAILED:
            return {
                ...state,
                sales: [],
                loading: false,
                error: action.payload.error,
            };
        case actionTypes.CREATE_SALE_DETAIL_FAILED:
            return {
                ...state,
                sales: [],
                isSaleDetail: true,
                error: action.payload.error,
            };
        default:
            return state;
    }
};

export default saleReducer;