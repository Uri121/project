import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './userReducer';
import orderReducer from './orderReducer';
import productReducer from './productReducer';
import errorReducer from './errorReducer';
export const store = createStore(
    combineReducers({
        user: userReducer,
        orderList: orderReducer,
        productList: productReducer,
        errors: errorReducer
    }),
    compose(
        applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

    )
);
