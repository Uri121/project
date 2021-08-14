import * as mutations from "../mutations";

const initialState = {
    token: localStorage.getItem("token"),
    isLoading: false,
    isAuthenticated: null,
    user: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case mutations.USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case mutations.USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            };
        case mutations.LOGIN_FAIL:
        case mutations.REGISTER_FAIL:
        case mutations.AUTH_ERROR:
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        case mutations.LOGIN_SUCCESS:
        case mutations.REGISTER_SUCCESS:
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false
            };

        default:
            return state;
    }
}

export default userReducer;