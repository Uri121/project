import * as mutations from '../mutations';
import axios from "axios";
import { history } from '../history';

export const registerUser = ({ fullName, email, password, role }) => async (dispatch) => {
    try {
        dispatch({ type: mutations.CLEAR_ERRORS })
        dispatch({ type: mutations.USER_LOADING });
        const { data } = await axios.put("user/create", {
            fullName,
            email,
            password,
            role
        });
        if (data.success) {
            dispatch({ type: mutations.REGISTER_SUCCESS, payload: data.payload });
            localStorage.setItem("token", data.payload.token);
            const [products, orders] = await getUserOrdersAndProducts(data.payload.token);
            if (products) dispatch({ type: mutations.PRODUCTS_LOADED, payload: products.data.payload })
            if (orders) dispatch({ type: mutations.ORDERS_LOADED, payload: orders.data.payload })
            history.push('/dashboard')
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.log(error);
        dispatch({ type: mutations.REGISTER_FAIL });
        dispatch({ type: mutations.GET_ERRORS, payload: { msg: error.toString(), id: "REGISTER_FAIL" } });

    }

};

export const loginUser = ({ email, password }) => async (dispatch) => {
    try {
        dispatch({ type: mutations.CLEAR_ERRORS })
        const { data } = await axios.post("user/login", {
            email,
            password,
        });
        if (data.success) {
            dispatch({ type: mutations.LOGIN_SUCCESS, payload: data.payload });
            localStorage.setItem("token", data.payload.token);
            const [products, orders] = await getUserOrdersAndProducts(data.payload.token);
            if (products) dispatch({ type: mutations.PRODUCTS_LOADED, payload: products.data.payload })
            if (orders) dispatch({ type: mutations.ORDERS_LOADED, payload: orders.data.payload })

            history.push('/dashboard')
        } else {

            throw new Error(data.error);
        }
    } catch (error) {
        dispatch({ type: mutations.LOGIN_FAIL });
        dispatch({ type: mutations.GET_ERRORS, payload: { msg: error.toString(), id: "LOGIN_FAIL" } });
        history.push("/");
    }

};

export const loadUser = () => async (dispatch, getState) => {
    try {
        dispatch({ type: mutations.USER_LOADING });
        dispatch({ type: mutations.CLEAR_ERRORS })
        const header = tokenConfig(getState);
        if (header) {
            const { data } = await axios.get("user/auth", header);

            if (data.success) {
                dispatch({ type: mutations.USER_LOADED, payload: data.payload });
                history.push('/dashboard')
                const [products, orders] = await getUserOrdersAndProducts(header.headers['x-auth-token']);
                if (products) dispatch({ type: mutations.PRODUCTS_LOADED, payload: products.data.payload })
                if (orders) dispatch({ type: mutations.ORDERS_LOADED, payload: orders.data.payload })

            } else {
                throw new Error(data.error);

            }
        }

    } catch (error) {
        dispatch({ type: mutations.AUTH_ERROR });
        dispatch({ type: mutations.GET_ERRORS, payload: { msg: error.toString(), id: "AUTH_ERROR" } });

    }

};

export const getFilterListItem = (list, value) => async (dispatch, getState) => {
    try {
        const header = tokenConfig(getState);
        const sendVal = value ? value : 'empty'
        if (header) {
            const { data } = await axios.get(`user/getFilterList/${list}/${sendVal}`, {
                headers: {
                    "x-auth-token": header.headers["x-auth-token"]
                }
            });
            if (data.success) {
                if (list === 'orders') {
                    dispatch({ type: mutations.ORDERS_LOADED, payload: data.payload })
                } else {
                    dispatch({ type: mutations.PRODUCTS_LOADED, payload: data.payload })
                }

            } else {
                throw new Error(data.error);

            }
        }

    } catch (error) {
        if (list === 'orders') {
            dispatch({ type: mutations.ORDERS_LOAD_FAIL })
        } else {
            dispatch({ type: mutations.PRODUCTS_LOADING_FAIL })
        }

    }
}

export const tokenConfig = getState => {
    const token = getState().user.token;
    const config = {
        headers: {}
    };
    if (token) {
        config.headers["x-auth-token"] = token;
        return config;
    }
};

const getUserOrdersAndProducts = async (token) => {
    const products = axios.get("product", {
        headers: {
            "x-auth-token": token
        }
    });
    const orders = axios.get('order', {
        headers: {
            "x-auth-token": token
        }
    });

    return await Promise.all([products, orders]);

}