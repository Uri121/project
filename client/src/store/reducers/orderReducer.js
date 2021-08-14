import * as mutations from "../mutations";

const initialState = {
    orders: [],
    isLoading: false
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case mutations.ORDERS_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case mutations.ORDER_STATUS_UPDATED:
        case mutations.ORDERS_LOADED:
            return {
                ...state,
                orders: action.payload,
                isLoading: false,
            };

        case mutations.ORDERS_CREATE:
            return {
                orders: [action.payload, ...state.orders],
                isLoading: false,
            };
        case mutations.ORDER_STATUS_UPDATE_FAIL:
        case mutations.ORDERS_CREATE_FAIL:
        case mutations.ORDERS_LOAD_FAIL:
            return {
                ...state,
                orders: [],
                isLoading: false
            };

        default:
            return state;
    }
}

export default orderReducer;