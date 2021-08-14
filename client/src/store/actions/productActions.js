import * as mutations from '../mutations';
import axios from "axios";
import { tokenConfig } from './userActions';

export const createProduct = ({ name, price }) => async (dispatch, getState) => {
    try {
        const header = tokenConfig(getState);
        if (header) {
            const { data } = await axios.put("product/create", {
                name,
                price
            }, header);
            if (data.success) {
                dispatch({ type: mutations.PRODUCTS_CREATED, payload: data.payload });
            } else {
                throw new Error(data.error);
            }
        }

    } catch (error) {
        console.log("error:", error);
        dispatch({ type: mutations.PRODUCTS_CREATED_FAIL });
        dispatch({ type: mutations.GET_ERRORS, payload: { msg: error.toString(), id: "PRODUCTS_CREATED_FAIL" } });
    }
}

