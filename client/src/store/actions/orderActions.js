import * as mutations from '../mutations';
import axios from "axios";
import { tokenConfig } from './userActions';

export const createOrder = (userId, products_ids) => async (dispatch, getState) => {
    try {
        dispatch({ type: mutations.CLEAR_ERRORS })
        const header = tokenConfig(getState);
        if (header) {
            dispatch({ type: mutations.ORDERS_LOADING });
            const { data } = await axios.put("order/create", {
                userId,
                products_ids
            }, header);
            if (data.success) {
                dispatch({ type: mutations.ORDERS_CREATE, payload: data.payload });
            } else {
                throw new Error(data.error);
            }
        }
    } catch (error) {
        dispatch({ type: mutations.ORDERS_CREATE_FAIL });
        dispatch({ type: mutations.GET_ERRORS, payload: { msg: error.toString(), id: "ORDERS_CREATE_FAIL" } });
    }
}

export const updateOrderStatus = (status, orderId) => async (dispatch, getState) => {
    try {
        dispatch({ type: mutations.CLEAR_ERRORS })
        const header = tokenConfig(getState);
        if (header) {
            const { data } = await axios.post(`order/${orderId}/${status}`, null, header);
            if (data.success) {
                dispatch({ type: mutations.ORDER_STATUS_UPDATED, payload: data.payload });
            } else {
                throw new Error(data.error);
            }
        }

    } catch (error) {
        console.log(error);
        dispatch({ type: mutations.ORDER_STATUS_UPDATE_FAIL });
        dispatch({ type: mutations.GET_ERRORS, payload: { msg: error.toString(), id: "ORDER_STATUS_UPDATE_FAIL" } });

    }

}

