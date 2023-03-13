import { createAction, handleActions } from 'redux-actions';

// Action Types
export const INITIALIZE_WEB_SOCKETS_CHANNEL =
  'websocket/INITIALIZE_WEB_SOCKETS_CHANNEL';
export const GET_MARKPRICE = 'websocket/GET_MARKPRICE';
export const GET_AGG_TRADE = 'websocket/GET_AGG_TRADE';
export const GET_AGG_TRADE_1S = 'websocket/GET_AGG_TRADE_1S';
export const GET_AGG_TRADE_1M = 'websocket/GET_AGG_TRADE_1M';
export const UPDATE_AGG_TRADE_1M = 'websocket/UPDATE_AGG_TRADE_1M';
export const CHANGE_AGG_TRADE_UNIT = 'websocket/CHANGE_AGG_TRADE_UNIT';
export const FETCH_INITIAL_DATA = 'websocket/FETCH_INITIAL_DATA';
export const SET_INITIAL_TRADE = 'websocket/SET_INITIAL_TRADE';
export const CLEAR_WEBSOCKET_DATA = 'websocket/CLEAR_WEBSOCKET_DATA';
export const CLEAR_ALL_DATA = 'websocket/CLEAR_ALL_DATA';
export const START_USER_DATA_STREAM = 'websocket/START_USER-DATA_STREAM';
export const SUBSCRIBE_NEW_SYMBOL_WEBSOCKET =
  'websocket/SUBSCRIBE_NEW_SYMBOL_WEBSOCKET';
export const GET_FUTURE_DAILY = 'websocket/GET_FUTURE_DAILY';
export const GET_FUTURES_DAILY ='websocket/GET_FUTURES_DAILY';
export const GET_SYMBOL_FUTURE_DAILY = 'websocket/GET_SYMBOL_FUTURE_DAILY';
export const GET_UNIT_VOLUME = 'websocket/GET_UNIT_VOLUME';
export const UNSUBSCRIBE_WEBSOCKET = 'websocket/UNSUBSCRIBE_WEBSOCKET';
export const UNMOUNT_WEBSCOKET_FUTURES = 'websocket/UNMOUNT_WEBSCOKET_FUTURES'
export const CHANGE_FUNDING_TIME = 'websocket/CHANGE_FUNDING_TIME';
export const CHANGE_RATE = 'websocket/CHANGE_RATE';
// initial State
const initialState = {
  status: '',
  data: {},
  futuredaily: [],
  futuresdaily:[],
  activefutures:[],
  socket: '',
  symbolmark: '',
  aggtrade: [],
  aggtradeOrderbook: [],
  aggTradeUnit: 'real', //real, 1s, 1m
  aggtrade1s: [],
  trade60: [],
  unitvolumeAlert:[],
  side: '',
  aggtrade1m: [],
  markprice: [],
  kline: {},
  liquidationOrder: [],
  listenKey: '',
  symbolfuture: {
    h:'0',
    l:'0',
    v:'0',
  },
  symbolmarkInfo: {},
  rate: 0,
  fundingTime: 1605081900000,
};

//  Reducer
const reducer = {
  [GET_MARKPRICE]: (state, action) => ({
    ...state,
    markprice: action.mark,
    symbolmark: action.symbolmark,
    symbolmarkInfo: action.symblmarkInfo
  }),
  [GET_AGG_TRADE]: (state, action) => ({
    ...state,
    aggtrade: [
      ...action.message.slice(0, action.message.length),
      ...state.aggtrade.slice(0, 150 - action.message.length),
    ],
  }),
  [GET_AGG_TRADE_1S]: (state, action) => ({
    ...state,
    aggtrade1s: [...action.message1s],
    trade60: [...action.message60],
  }),
  [GET_AGG_TRADE_1M]: (state, action) => ({
    ...state,
    aggtrade1m: [...action.message],
  }),
  [UPDATE_AGG_TRADE_1M]: (state,action) => ({
    ...state,
    aggtrade1m: [...action.message,...state.aggtrade1m.slice(0,118)]
  }),
  [GET_UNIT_VOLUME]: (state,action) => ({
    ...state,
    unitvolumeAlert: [...action.unitvolume]
  }),
  [CHANGE_AGG_TRADE_UNIT]: (state, action) => ({
    ...state,
    aggTradeUnit: action.payload,
  }),
  [SET_INITIAL_TRADE]: (state, action) => ({
    ...state,
    aggtrade: action.message,
  }),
  [FETCH_INITIAL_DATA]: (state, action) => ({
    ...state,
    aggtrade: action.payload.aggtrade,
    // liquidationOrder: action.payload.liquidation,
  }),
  [GET_FUTURE_DAILY]: (state, action) => ({
    ...state,
    futuredaily: action.daily,
  }),
  [GET_FUTURES_DAILY]: (state, action) => ({
    ...state,
    futuresdaily: action.dailys,
    activefutures: action.actives
  }),
  [GET_SYMBOL_FUTURE_DAILY]: (state,action) => ({
    ...state,
    symbolfuture: action.payload
  }),
  [CLEAR_WEBSOCKET_DATA]: (state) => ({
    ...state,
    aggtrade: [],
    markprice: [],
    aggtrade1s: [],
    aggtrade1m: [],
    trade60:[],
    liquidationOrder: [],
    aggTradeUnit: 'real',
    aggtradeOrderbook: [],
  }),
  [START_USER_DATA_STREAM]: (state, action) => ({
    ...state,
    listenKey: action.payload,
  }),
  [CHANGE_FUNDING_TIME]: (state,action) => ({
    ...state,
    fundingTime: action.payload
  }),
  [CHANGE_RATE]: (state,action) => ({
    ...state,
    rate: action.payload
  })
};

//  Action Creator

export const initializeWebsocket = createAction(INITIALIZE_WEB_SOCKETS_CHANNEL);
export const getMarkprice = createAction(GET_MARKPRICE);
export const getAggTrade = createAction(GET_AGG_TRADE);
export const getAggTrade1s = createAction(GET_AGG_TRADE_1S);
export const getAggTrade1m = createAction(GET_AGG_TRADE_1M);
export const updateAggTrade1m = createAction(UPDATE_AGG_TRADE_1M);
export const getUnitVolume = createAction(GET_UNIT_VOLUME);
export const changeAggTradeUnit = createAction(CHANGE_AGG_TRADE_UNIT);
export const fetchInitialData = createAction(FETCH_INITIAL_DATA);
export const setInitialTrade = createAction(SET_INITIAL_TRADE);
export const unsubscribeWebsocket = createAction(UNSUBSCRIBE_WEBSOCKET);
export const clearWebsocketData = createAction(CLEAR_WEBSOCKET_DATA);
export const clearAllData = createAction(CLEAR_ALL_DATA);
export const startUserStream = createAction(START_USER_DATA_STREAM);
export const subscribeNewSymbolWebsocket = createAction(
  SUBSCRIBE_NEW_SYMBOL_WEBSOCKET,
);
export const getFutureDaily = createAction(GET_FUTURE_DAILY);
export const getFuturesDaily = createAction(GET_FUTURES_DAILY);
export const getSymbolFutureDaily = createAction(GET_SYMBOL_FUTURE_DAILY);
export const unMountWebsocketFutures = createAction(UNMOUNT_WEBSCOKET_FUTURES);
export const changeFundingTime = createAction(CHANGE_FUNDING_TIME);
export const changeRate = createAction(CHANGE_RATE);

export default handleActions(reducer, initialState);
