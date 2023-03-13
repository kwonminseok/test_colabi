import { createAction, handleActions } from 'redux-actions';

// Action Types
export const CHANGE_DEPTH_UNIT = 'orderbook/CHANGE_DEPTH_UNIT';
export const CHANGE_IS_SINGLE = 'orderbook/CHANGE_IS_SINGLE';
export const SET_BIG_SUM = 'orderbook/SET_BIG_SUM';
export const SET_ORDERBOOK = 'orderbook/SET_ORDERBOOK';

export const CLEAR_ORDERBOOK = 'orderbook/CLEAR_ORDERBOOK';
export const SET_ORDERTYPE = 'orderbook/SET_ORDERTYPE';
export const SET_ORDERBOOK_TRADE_TYPE = 'orderbook/SET_ORDERBOOK_TRADE_TYPE';
export const SET_ORDERBOOK_ORDER_AMOUNT =
  'orderbook/SET_ORDERBOOK_ORDER_AMOUNT';
export const SUMMIT_ORDERBOOK_ORDER = 'orderbook/SUMMIT_ORDERBOOK_ORDER';
// initial State
const initialState = {
  unit: 0.1,
  orderbookMode: 'dual',
  signdigit: 1,
  bigsum: 0,
  bids: [],
  asks: [],
  tradeType: 'off',
  orderType: 'buy',
  value: 0,
  amount: '',
  sizedigit: 3,
  pricedigit: 2
};

//  Reducer
const reducer = {
  [CHANGE_DEPTH_UNIT]: (state, action) => ({
    ...state,
    unit: action.unit,
    signdigit: action.digit,
  }),
  [CHANGE_IS_SINGLE]: (state, action) => ({
    ...state,
    orderbookMode: action.isSingle,
  }),
  [SET_ORDERTYPE]: (state, action) => ({
    ...state,
    orderType: action.orderType,
  }),
  [SET_ORDERBOOK_TRADE_TYPE]: (state, action) => ({
    ...state,
    tradeType: action.payload,
  }),
  [SET_BIG_SUM]: (state, action) => ({
    ...state,
    bigsum: action.sum,
  }),
  [SET_ORDERBOOK]: (state, action) => ({
    ...state,
    bids: action.bids,
    asks: action.asks,
    bigsum: action.sum,
  }),
  [CLEAR_ORDERBOOK]: () => initialState,
  [SET_ORDERBOOK_ORDER_AMOUNT]: (state, action) => ({
    ...state,
    amount: action.payload.amount,
    value: action.payload.value,
  }),
};

//  Action Creator
export const changeDepthUnit = createAction(CHANGE_DEPTH_UNIT);
export const setOrderbookTradeType = createAction(SET_ORDERBOOK_TRADE_TYPE);
export const setBigsum = createAction(SET_BIG_SUM);
export const setOrderbook = createAction(SET_ORDERBOOK);
export const clearOrderbook = createAction(CLEAR_ORDERBOOK);
export const setOrderbookOrderAmount = createAction(SET_ORDERBOOK_ORDER_AMOUNT);
export const summitOrderbookOrder = createAction(SUMMIT_ORDERBOOK_ORDER);
export const changeIsSingle = createAction(CHANGE_IS_SINGLE);
export default handleActions(reducer, initialState);
