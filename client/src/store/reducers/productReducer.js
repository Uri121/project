import * as mutations from "../mutations";

const initialState = {
    products: [],
    isLoading: false
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case mutations.PRODUCTS_LOADING_START:
            return {
                ...state,
                isLoading: true
            };
        case mutations.PRODUCTS_LOADED:
            return {
                ...state,
                products: action.payload,
                isLoading: false,
            };
        case mutations.PRODUCTS_CREATED:
            return {
                products: [action.payload, ...state.products],
                isLoading: false,
            };
        case mutations.PRODUCTS_CREATED_FAIL:
        case mutations.PRODUCTS_LOADING_FAIL:
            return {
                ...state,
                products: [],
                isLoading: false
            };

        default:
            return state;
    }
}

export default productReducer;