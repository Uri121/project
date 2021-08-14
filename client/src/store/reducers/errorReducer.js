import * as mutations from "../mutations";

const initialState = {
    msg: null,
    id: null
};

const errorReducer = (state = initialState, action) => {
    switch (action.type) {
        case mutations.GET_ERRORS:
            return {
                msg: action.payload.msg,
                id: action.payload.id
            };
        case mutations.CLEAR_ERRORS:
            return {
                msg: null,
                id: null
            };
        default:
            return state;
    }
}

export default errorReducer