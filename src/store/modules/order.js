import { createAction, handleActions } from 'redux-actions';

export const SET_PRICE = 'order/SET_PRICE';
export const CHANGE_REACH = 'order/CHANGE_REACH';
export const CHANGE_BASE = 'order/CHANGE_BASE';
export const CHANGE_PERCENT = 'order/CHANGE_PERCENT';
export const CHANGE_AMOUNT = 'order/CHANGE_AMOUNT';
export const CHANGE_ACTIVE = 'order/CHANGE_ACTIVE';
export const CHANGE_ISPOST = 'order/CHANGE_ISPOST';
export const CHANGE_ISREDUCE = 'order/CHANGE_ISREDUCE';
export const CHANGE_ISMARKET = 'order/CHANGE_ISMARKET';
export const CHANGE_ISKLINE = 'order/CHANGE_ISKLINE';
export const CHANGE_TRIGER_PRICE = 'order/CHANGE_TRIGER_PRICE'
export const CHANGE_TRIGER = 'order/CHANGE_TRIGER';
export const CLEAR_STATE = 'order/CLEAR_STATE';
export const CHANGE_KLINE = 'order/CHANGE_KLINE';
export const CHANGE_KLINE_DIRECTION = 'order/CHANGE_KLINE_DIRECTION';
export const CLEAR_ALL_EXCEPT_PRICE = 'order/CLEAR_ALL_EXCEPT_PRICE'
const initialState = {
    active: 'Limit',
    reach: '' ,
    base: '',
    triger:'',
    price:'',
    amount:'',
    value:'',
    kline: '5m',
    klineDirection: 'up',
    trigerprice: "last Price",
    isPost: false,
    isReduce: false,
    isMarket: false,
    isKline: false
}

const reducer = {
    [CLEAR_STATE]: (state) => initialState,
    [CLEAR_ALL_EXCEPT_PRICE]: (state) =>({
        ...state,
        reach: '' ,
        base: '',
        amount:'',
        value:'',
        triger:'',
        active: 'Limit'
    }),
    [SET_PRICE]: (state,action) => ({
        ...state,
        price: action.payload
    }),
    [CHANGE_PERCENT]: (state,action) => ({
        ...state,
        amount: action.payload.amount,
        value: action.payload.value
    }),
    [CHANGE_AMOUNT]: (state,action) => ({
        ...state,
        amount: action.payload,
        value: 0
    }),
    [CHANGE_REACH]: (state, action) => ({
        ...state,
        reach: action.payload
    }),
    [CHANGE_BASE]: (state,action) => ({
        ...state,
        base: action.payload
    }),
    [CHANGE_ACTIVE]: (state,action) => ({
        ...state,
        active: action.payload
    }),
    [CHANGE_ISPOST]: (state,action) => ({
        ...state,
        isPost: action.payload
    }),
    [CHANGE_ISREDUCE]: (state,action) => ({
        ...state,
        isReduce: action.payload
    }),
    [CHANGE_ISMARKET]: (state,action) => ({
        ...state,
        isMarket: action.payload
    }),
    [CHANGE_ISKLINE]: (state,action) => ({
        ...state,
        isKline: action.payload
    }),
    [CHANGE_TRIGER]: (state,action) => ({
        ...state,
        triger: action.payload
    }),
    [CHANGE_TRIGER_PRICE]: (state,action) => ({
        ...state,
        trigerprice: action.payload
    }),
    [CHANGE_KLINE]: (state,action) => ({
        ...state,
        kline: action.payload
    }),
    [CHANGE_KLINE_DIRECTION]: (state,action) => ({
        ...state,
        klineDirection: action.payload
    })
}

export const clearState = createAction(CLEAR_STATE);
export const clearAllExceptPrice = createAction(CLEAR_ALL_EXCEPT_PRICE)
export const setPrice = createAction(SET_PRICE);
export const changeReach = createAction(CHANGE_REACH);
export const changeBase = createAction(CHANGE_BASE);
export const changePercent = createAction(CHANGE_PERCENT);
export const changeAmount = createAction(CHANGE_AMOUNT);
export const changeActive = createAction(CHANGE_ACTIVE);
export const changeIsPost = createAction(CHANGE_ISPOST);
export const changeIsReduce = createAction(CHANGE_ISREDUCE);
export const changeIsMarket = createAction(CHANGE_ISMARKET);
export const changeIsKline = createAction(CHANGE_ISKLINE);
export const changeTriger = createAction(CHANGE_TRIGER);
export const changeTrigerPrice = createAction(CHANGE_TRIGER_PRICE);
export const changeKline = createAction(CHANGE_KLINE);
export const changeKlineDirection = createAction(CHANGE_KLINE_DIRECTION);
export default handleActions(reducer,initialState);