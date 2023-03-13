import { createAction, handleActions } from 'redux-actions';

export const GET_AGG_TRADE = 'api/GET_AGG_TRADE';
export const CHECK_USER_CAN = 'api/CHECK_USER_CAN';
export const SET_USER_API_KEY = 'api/SET_USER_API_KEY';
export const CHANGE_MARGIN_MODE = 'api/CHANGE_MARGIN_MODE';
export const CHANGE_LEVERAGE = 'api/CHANGE_LEVERAGE';
export const SET_OPENINTEREST = 'api/SET_OPENINTEREST';
export const GET_OPENINTEREST = 'api/GET_OPENINTEREST';
export const CANCEL_ORDER = 'api/CANCEL_ORDER';
export const CANCEL_REACH_ORDER = 'api/CANCEL_REACH_ORDER';
export const CANCEL_CLOSE_ORDER = 'api/CANCEL_CLOSE_ORDER';
export const CANCEL_ALL_RESERVE_ORDER = 'api/CANCEL_ALL_RESERVE_ORDER';
export const GET_USER_INCOME = 'api/GET_USER_INCOME';
export const UNMOUNT_FUTURES = 'api/UNMOUNT_FUTURES';
export const GET_EXCHANGE_INFO = 'api/GET_EXCHANGE_INFO';
export const GET_HOME_KLINE_DATA = 'api/GET_HOME_KLINE_DATA';
export const SET_HOME_KLINE_DATA = 'api/SET_HOME_KLINE_DATA';
export const INITIAL_API_DATA = 'api/INITIAL_API_DATA'
export const REINITIAL_API_DATA = 'api/REINITIAL_API_DATA';
export const SUMMIT_ORDER = 'api/SUMMIT_ORDER'
const initialState = {
  openInterest: 0,
  btc: [],
  eth: [],
  link: [],
  btchl:[],
  ethhl:[],
  linkhl:[],
  isReady: false
};

const reducer = {
  [SET_OPENINTEREST]: (state, action) => ({
    ...state,
    openInterest: action.payload,
  }),
  [SET_HOME_KLINE_DATA]: (state, action) => ({
    ...state,
    btc: action.payload.btc,
    eth: action.payload.eth,
    link: action.payload.link,
    btchl: action.payload.btchl,
    ethhl: action.payload.ethhl,
    linkhl: action.payload.linkhl,
    isReady: true
  })
};

export const getAggTrade = createAction(GET_AGG_TRADE);
export const setUserApiKey = createAction(SET_USER_API_KEY);
export const changeMarginMode = createAction(CHANGE_MARGIN_MODE);
export const changeLeverage = createAction(CHANGE_LEVERAGE);
export const setOpeninterest = createAction(SET_OPENINTEREST);
export const getOpeninterest = createAction(GET_OPENINTEREST);
export const cancelOrder = createAction(CANCEL_ORDER);
export const cancelReachOrder = createAction(CANCEL_REACH_ORDER);
export const cancelCloseOrder = createAction(CANCEL_CLOSE_ORDER);
export const cancelAllReserveOrder = createAction(CANCEL_ALL_RESERVE_ORDER);
export const getUserIncome = createAction(GET_USER_INCOME);
export const unMountFutures = createAction(UNMOUNT_FUTURES);
export const getHomeKlineData =createAction(GET_HOME_KLINE_DATA);
export const setHomeKlineData =createAction(SET_HOME_KLINE_DATA);
export const initialApiData = createAction(INITIAL_API_DATA);
export const reinitialApiData = createAction(REINITIAL_API_DATA);
export const summitOrder = createAction(SUMMIT_ORDER);
export default handleActions(reducer, initialState);
