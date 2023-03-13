import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';
// Action Types
export const AUTH_LOGOUT = 'user/AUTH_LOGOUT';
export const USER_AUTH_TOTAL = 'user/USER_AUTH_TOTAL'
export const USER_AUTH_SIMPLE = 'user/USER_AUTH_SIMPLE'
export const SET_USER_BALANCE = 'user/SET_USER_BALANCE'
export const SET_USER_MEMBERSHIP_HISTORY = 'user/SET_USER_MEMBERSHIP_HISTORY';
export const AUTH_LOGIN_SUCCESS = 'user/AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'user/AUTH_LOGIN_FAILURE';
export const GET_USER_INFO = 'user/GET_USER_INFO';
export const SET_USER_CHECK = 'user/SET_USER_CHECK';
export const SET_USER_STATUS = 'user/SET_USER_STATUS';
export const SET_USER_TRADING_INFO = 'user/SET_USER_TRADING_INFO';
export const CHANGE_SYMBOL_LEVERAGE = 'user/CHANGE_SYMBOL_LEVERAGE';
export const ORDER_UPDATE = 'user/ORDER_UPDATE';
export const GET_OPENORDER_MARGIN = 'user/GET_OPENORDER_MARGIN';
export const SET_USER_RESERVE_ORDER = 'user/SET_USER_RESERVE_ORDER';
export const DELETE_RESERVE_ORDER = 'user/DELETE_RESERVE_ORDER';
export const DELETE_ALL_RESERVE_ORDER = 'user/DELETE_ALL_RESERVE_ORDER';
export const ADD_USER_RESERVE_ORDER = 'user/ADD_USER_RESERVE_ORDER';
export const SET_USER_ASSETS = 'user/SET_USER_ASSETS';
export const SET_USER_INCOME = 'user/SET_USER_INCOME';
export const VIEW_FALSE = 'user/VIEW_FALSE';
export const VIEW_TRUE ='user/VIEW_TRUE';
export const SET_LAYOUTLIST = 'user/SET_LAYOUTLIST'; 
export const PUT_LAYOUT = 'user/PUT_LAYOUT';
export const SET_MBC = 'user/SET_MBC'
export const SET_USER_ACCOUNT_INFO = 'user/SET_USER_ACCOUNT_INFO';
export const UPDATE_USER_ACCOUNT_INFO = 'user/UPDATE_USER_ACCOUNT_INFO';
export const UPDATE_USER_TRADING_MARGIN = 'user/UPDATE_USER_TRADING_MARGIN';
export const CHANGE_BOOK_ORDER_MODE = 'user/CHANGE_BOOK_ORDER_MODE';
export const CHANGE_MOBLIST_ISCOR = 'user/CHANGE_MOBLIST_ISCOR';
export const CHANGE_MOBLIST_ISPOR = 'user/CHANGE_MOBLIST_ISPOR';
export const CHANGE_MOBLIST_ISOD = 'user/CHANGE_MOBLIST_ISOD';
export const CHANGE_MOBLIST_ISWM  = 'user/CHANGE_MOBLIST_ISWM';
export const CHANGE_NOW_TRADING_INFO = 'user/CHANGE_NOW_TRADING_INFO'
export const RESET_LAYOUT = 'user/RESET_LAYOUT';
export const UPDATE_USER_POSITIONS = 'user/UPDATE_USER_POSITIONS';
export const UPDATE_USER_TOAST_WEBSOCKET = 'user/UPDATE_USER_TOAST_WEBSOCKET';
export const UPDATE_USER_TOAST_API = 'user/UPDATE_USER_TOAST_API';
export const SET_USER_IS_API = 'user/SET_USER_IS_API';

export const SET_LOGGED_USER_OPTIOANL = 'user/SET_LOGGED_USER_OPTIOANL';
export const UPDATE_USER_OPTIONAL = 'user/UPDATE_USER_OPTIONAL';
export const SET_USER_OPTIONAL = 'user/SET_USER_OPTIONAL';
export const SET_USER_OPTIONAL_ACTIVE = 'user/SET_USER_OPTIONAL_ACTIVE';

export const CHANGE_FILTER_PRICE = 'user/CHANGE_FILTER_PRICE';
export const CHANGE_FILTER_PERCENT = 'user/CHANGE_FILTER_PERCENT';
export const CHANGE_FILTER_SYMBOL_NAME = 'user/CHANGE_FILTER_SYMBOL_NAME';
export const CHANGE_FILTER_INFO = 'user/CHANGE_FILTER_INFO';
const initialState = {
  status: true,
  logstatus: 'WAITING',
  isLoggedIn: false,
  isApi: true,
  usercheck: {
    ismember: false,
    isApi: 'yet',
    canTrade: false,
    status: false,
  },
  useOptional:{
    active: false,
    optional:'BTCUSDT,ETHUSDT,LINKUSDT,',
    filter:{
      symbol:'',
      price: 'none',
      percent:"none"
    }
  },
  mbc: {
    check: 'not',
    mb: '',
    bookorderMode: false,
  },
  moblist:{
    isCOR: true,
    isPOR: true,
    isOD:true,
    isWM: true,
  },
  layoutlist:{
    chart: true,
    orderbook: true,
    recents: true,
    userInfo: true,
  },
  layoutReset:0,
  isLayout: false,
  userstatus: "none",
  userInfo: {
    id: 'Guest',
    isMem: false,
    key: [],
    listenKey: '',
    streamTime: 0,
    digit: 0,
    nick: '',
    tag: '',
    Exmem: 0,
    isReady: false,
    layouts: [],
    isLayout: false,
    history: []
  },
  userBalance:{
  },
  userTraInfo: {
    margin: [],
    position: [],
    openOrder: [],
    activeOrder: [],
    stopOrder: [],
    nowOpenOrder:[],
    nowPosition:[],
    pl:0,
    al:0,
    sl:0
  },
  userMargin: {
    activeOrder: [],
  },
  reserve: {
    reserveMargin: [],
    idList: [],
  },
  transfer:{
    transferlist: [],
    income: [],
    isTransferReady: false,
    isIncomeReady: false,
  },
  toastInfo:{
    api:{
      num:0,
      status:"",
      message:''
    },
    websocket:{
      num:0,
      status:"",
      side:"",
      type:""
    }
  }
};

// Reducer
const reducer = {
  [AUTH_LOGOUT]: () => initialState,
  [AUTH_LOGIN_SUCCESS]: state => ({
    ...state,
    logstatus: 'LOGIN',
    isLoggedIn: true,
  }),
  [AUTH_LOGIN_FAILURE]: state => ({
    ...state,
    logstatus: 'LOGOUT',
    isLoggedIn: false,
    userstatus: 'guest'
  }),
  [GET_USER_INFO]: (state, action) => ({
    ...state,
    userInfo: {
      ...state.userInfo,
      isMem: action.payload.isMember,
      id: action.payload.userId,
      key: [action.payload.ia,action.payload.ts],
      digit: action.payload.digit,
      nick: action.payload.nickName,
      tag: action.payload.tag,
      Exmem: action.payload.expired,
      isReady: action.payload.isReady
    },
  }),
  [SET_USER_MEMBERSHIP_HISTORY]: (state, action) => ({
    ...state,
    userInfo: {
      ...state.userInfo,
      history: action.payload.history
    }
  }),
  [SET_USER_TRADING_INFO]: (state, action) => ({
    ...state,
    userTraInfo: {
      margin: action.payload.margin,
      position: action.payload.position,
      openOrder: action.payload.openorder,
      activeOrder: action.payload.active,
      stopOrder: action.payload.stop,
      nowPosition: action.payload.nowPosition,
      nowOpenOrder: action.payload.nowOpenOrder,
      pl: action.payload.pl,
      al: action.payload.al,
      sl: action.payload.sl
    },
  }),
  [SET_USER_CHECK]: (state, action) => ({
    ...state,
    usercheck: {
      ismember: action.payload.ismem,
      isApi: action.payload.isApi,
      canTrade: action.payload.canTrade,
      status: action.payload.status,
    },
  }),
  [SET_USER_IS_API]: (state,action) =>({
    ...state,
    isApi: action.payload
  }),
  [SET_USER_STATUS]: (state,action) => ({
    ...state,
    userstatus: action.payload
  }),
  [CHANGE_SYMBOL_LEVERAGE]: (state, action) => ({
    ...state,
    userTraInfo: {
      ...state.userTraInfo,
      position: action.payload.positions,
      nowPosition: action.payload.nowPosition
    },
  }),
  [ORDER_UPDATE]: (state, action) => ({
    ...state,
    userTraInfo: {
      ...state.userTraInfo,
      openOrder: action.orderlist,
      activeOrder: action.active,
      stopOrder: action.stop,
      nowOpenOrder: action.nowOpenOrder,
      al: action.al,
      sl: action.sl
    },
  }),
  [CHANGE_NOW_TRADING_INFO]: (state,action) => ({
    ...state,
    userTraInfo:{
      ...state.userTraInfo,
      nowOpenOrder: action.payload.openOrder,
      nowPosition: action.payload.position
    }
  }),
  [GET_OPENORDER_MARGIN]: (state, action) => ({
    ...state,
    userMargin: {
      ...state.userMargin,
      activeOrder: action.payload.activemargin,
    },
  }),
  [SET_MBC]: (state,action) => ({
    ...state,
    mbc:{
      ...state.mbc,
      check: action.payload.check,
      mb: action.payload.mb
    }
  }),
  [SET_USER_RESERVE_ORDER]: (state,action) => ({
    ...state,
    reserve: {
      ...state.reserve,
      reserveMargin:  action.payload.reserve,
      //idList: action.payload.idlist
    }
  }),
  [DELETE_RESERVE_ORDER]: (state,action)=> ({
    ...state,
    reserve: {
      ...state.reserve,
      reserveMargin: state.reserve.reserveMargin.filter(item => item.ClientId !== action.payload),
      //idList: state.reserve.idList.filter(item => item !== action.clientId)
    }
  }),
  [DELETE_ALL_RESERVE_ORDER]: (state) => ({
    ...state,
    reserve:{
      ...state.reserve,
      reserveMargin: []
    }
  }),
  [ADD_USER_RESERVE_ORDER]: (state,action) => ({
    ...state,
    reserve: {
      ...state.reserve,
      reserveMargin: [...state.reserve.reserveMargin, action.order],
      //idList: [...state.reserve.idList, action.id]
    }
  }),
  [SET_USER_ASSETS]: (state,action) => ({
    ...state,
    userTraInfo: {
      ...state.userTraInfo,
      margin: action.asset,
      position: action.position
    }
  }),
  [SET_USER_BALANCE]: (state,action) => ({
    ...state,
    userBalance:{
      ...state.userBalance,
      asset: action.asset,
      wallet: action.wallet,
      available: action.available,
      unRealPnl: action.unRealPnl
    }
  }),
  [SET_USER_INCOME]: (state,action) => ({
    ...state,
    transfer: {
      ...state.transfer,
      income: action.payload.income,
      transferlist: action.payload.transfer,
      isTransferReady: true,
      isIncomeReady: true,
    }
  }),
  [SET_LAYOUTLIST]: (state,action) => {
    const layout = action.payload;
    let a = {
      chart: false,
      orderbook: false,
      recents: false,
      alarms: false,
      userInfo: false,
    }
    _.forEach(layout, item => {
      a[item.i] = true
    })
    return({
      ...state,
      layoutlist: a,
      isLayout: true
    })
  },
  [PUT_LAYOUT]: (state,action) => ({
    ...state,
    layoutlist:{
      ...state.layoutlist,
      [action.payload]: !state.layoutlist[action.payload]
    }
  }),
  [SET_USER_ACCOUNT_INFO]: (state,action) => ({
    ...state,
    userBalance: action.payload
  }),
  [UPDATE_USER_ACCOUNT_INFO]: (state,action) => ({
    ...state,
    userBalance: {
      ...state.userBalance,
      symbolPosition: action.payload.symbolPosition,
      positions: action.payload.positions,
      crossMaintMargin: action.payload.crossMaintMargin,
      crossPositionValue: action.payload.crossPositionValue,
      crossWallet: action.payload.crossWallet,
      positionInitialMargin: action.payload.positionInitialMargin,
      openOrderInitialMargin: action.payload.openOrderInitialMargin,
      crossedUnPnl: action.payload.crossedUnPnl,
      unRealizedPnl: action.payload.unRealizedPnl,
      maintAmount: action.payload.maintAmount,
      availableBalance: action.payload.availableBalance
    }
  }),
  [UPDATE_USER_TRADING_MARGIN]: (state,action) => ({
    ...state,
    userTraInfo: {
      ...state.userTraInfo,
      margin: action.payload.margin
    },
    userBalance: {
      ...state.userBalance,
      walletBalance: action.payload.margin[0].walletBalance
    }
  }),
  [CHANGE_BOOK_ORDER_MODE]: (state,action) => ({
    ...state,
    mbc:{
      ...state.mbc,
      bookorderMode: action.payload
    }
  }),
  [CHANGE_MOBLIST_ISCOR]: (state,action) => ({
    ...state,
    moblist:{
      ...state.moblist,
      isCOR: action.payload
    }
  }),
  [CHANGE_MOBLIST_ISPOR]: (state,action) => ({
    ...state,
    moblist:{
      ...state.moblist,
      isPOR: action.payload
    }
  }),
  [CHANGE_MOBLIST_ISOD]: (state,action) => ({
    ...state,
    moblist:{
      ...state.moblist,
      isOD: action.payload
    }
  }),
  [CHANGE_MOBLIST_ISWM]: (state,action) => ({
    ...state,
    moblist:{
      ...state.moblist,
      isWM: action.payload
    }
  }),
  [RESET_LAYOUT]: (state) => ({
    ...state,
    layoutlist: initialState.layoutlist,
    layoutReset: state.layoutReset+1,

  }),
  [UPDATE_USER_POSITIONS]: (state,action) =>({
    ...state,
    userTraInfo:{
      ...state.userTraInfo,
      position: action.payload.position,
      pl: action.payload.hl,
      nowPosition: action.payload.nowPosition
    }
  }),
  [UPDATE_USER_TOAST_WEBSOCKET]: (state,action) =>({
    ...state,
    toastInfo:{
      ...state.toastInfo,
      websocket:{
        num : action.payload.num,
        status: action.payload.status,
        side: action.payload.side,
        type: action.payload.type
      }
    }
  }),
  [UPDATE_USER_TOAST_API]: (state,action) =>({
    ...state,
    toastInfo:{
      ...state.toastInfo,
      api:{
        num:action.payload.num,
        status:action.payload.status,
        message:action.payload.message
      }
    }
  }),
  [VIEW_FALSE]: (state) =>({
    ...state,
    status: false
  }),
  [VIEW_TRUE]: (state) =>({
    ...state,
    status : true
  }),
  [SET_USER_OPTIONAL_ACTIVE]:(state,action) =>({
    ...state,
    useOptional:{
      ...state.useOptional,
      active: action.payload
    }
  }),
  [SET_USER_OPTIONAL]: (state,action) =>({
    ...state,
    useOptional:{
      ...state.useOptional,
      optional: action.payload
    }
  }),
  [CHANGE_FILTER_PRICE] : (state,action) =>({
    ...state,
    useOptional:{
      ...state.useOptional,
      filter:{
        ...state.useOptional.filter,
        price: action.payload
      }
    }
  }),
  [CHANGE_FILTER_PERCENT] : (state,action) =>({
    ...state,
    useOptional:{
      ...state.useOptional,
      filter:{
        ...state.useOptional.filter,
        percent: action.payload
      }
    }
  }),
  [CHANGE_FILTER_SYMBOL_NAME] : (state,action) =>({
    ...state,
    useOptional:{
      ...state.useOptional,
      filter:{
        ...state.useOptional.filter,
        symbol: action.payload
      }
    }
  }),
  [CHANGE_FILTER_INFO]: (state,action) =>({
    ...state,
    useOptional:{
      ...state.useOptional,
      filter:{
        ...state.useOptional.filter,
        price: action.payload.price,
        percent: action.payload.percent
      }
    }
  })
 };

//  Action Creator
export const authLogout = createAction(AUTH_LOGOUT);
export const userAuthTotal = createAction(USER_AUTH_TOTAL);
export const userAuthSimple = createAction(USER_AUTH_SIMPLE)
export const setUserBalance = createAction(SET_USER_BALANCE);
export const setUserMembershipHistory = createAction(SET_USER_MEMBERSHIP_HISTORY);
export const authLoginSuccess = createAction(AUTH_LOGIN_SUCCESS);
export const authLoginFailure = createAction(AUTH_LOGIN_FAILURE);
export const getUserInfo = createAction(GET_USER_INFO);
export const setUserIsApi = createAction(SET_USER_IS_API);
export const setUserCheck = createAction(SET_USER_CHECK);
export const setUserStatus = createAction(SET_USER_STATUS);
export const setUserTradingInfo = createAction(SET_USER_TRADING_INFO);
export const changeSymbolLeverage = createAction(CHANGE_SYMBOL_LEVERAGE);
export const orderUpdatae = createAction(ORDER_UPDATE);
export const getOpenOrderMargin = createAction(GET_OPENORDER_MARGIN);
export const setUserReserveOrder = createAction(SET_USER_RESERVE_ORDER);
export const deleteReserveOrder = createAction(DELETE_RESERVE_ORDER);
export const deleteAllReserveOrder =createAction(DELETE_ALL_RESERVE_ORDER);
export const addUserReserveOrder = createAction(ADD_USER_RESERVE_ORDER);
export const setUserAssets = createAction(SET_USER_ASSETS);
export const setUserIncome = createAction(SET_USER_INCOME);

export const setLayoutlist = createAction(SET_LAYOUTLIST)
export const putLayout = createAction(PUT_LAYOUT);
export const setMbc = createAction(SET_MBC);
export const setUserAccountInfo = createAction(SET_USER_ACCOUNT_INFO);
export const updateUserAccountInfo = createAction(UPDATE_USER_ACCOUNT_INFO);
export const updateUserTradingMargin = createAction(UPDATE_USER_TRADING_MARGIN);
export const changebookOrderMode = createAction(CHANGE_BOOK_ORDER_MODE);
export const changeMoblistIsCOR = createAction(CHANGE_MOBLIST_ISCOR);
export const changeMoblistIsPOR = createAction(CHANGE_MOBLIST_ISPOR);
export const changeMoblistIsOD = createAction(CHANGE_MOBLIST_ISOD);
export const changeMoblistIsWM = createAction(CHANGE_MOBLIST_ISWM);
export const changeNowTradingInfo = createAction(CHANGE_NOW_TRADING_INFO);
export const resetLayout = createAction(RESET_LAYOUT);
export const updateUserPositions = createAction(UPDATE_USER_POSITIONS);
export const updateUserToastWebsocket = createAction(UPDATE_USER_TOAST_WEBSOCKET);
export const updateUserToastApi = createAction(UPDATE_USER_TOAST_API);
export const viewFalse = createAction(VIEW_FALSE);
export const viewTrue = createAction(VIEW_TRUE);


export const setLoggedUserOptional = createAction(SET_LOGGED_USER_OPTIOANL);
export const updateUserOptional = createAction(UPDATE_USER_OPTIONAL);
export const setUserOptional = createAction(SET_USER_OPTIONAL)
export const setUserOptionalActive = createAction(SET_USER_OPTIONAL_ACTIVE)

export const changeFilterPrice = createAction(CHANGE_FILTER_PRICE)
export const changeFilterPercent = createAction(CHANGE_FILTER_PERCENT)
export const changeFilterSymbolName = createAction(CHANGE_FILTER_SYMBOL_NAME);
export const changeFilterInfo = createAction(CHANGE_FILTER_INFO)
export default handleActions(reducer, initialState);

