import { takeEvery, all, select, call, put, delay } from 'redux-saga/effects';
import axios from 'axios';
import _ from 'lodash';
import encryption from '../../encryption';

const Binance = require('node-binance-api');
const binance = new Binance().options({
  useServerTime: true,
});
const max125Contract=[{min:0, max:50000,rate:0.4,maxleverage:125, marginAmount: 0},
  {min:50000, max:250000,rate:0.5,maxleverage:100,marginAmount: 50},
  {min:250000, max:1000000,rate:1.0,maxleverage:50,marginAmount: 1300},
  {min:1000000, max:5000000,rate:2.5,maxleverage:20,marginAmount:16300},
  {min:5000000, max:20000000,rate:5.0,maxleverage:10,marginAmount:141300},
  {min:20000000, max:50000000,rate:10.0,maxleverage:5,marginAmount:1141300},
  {min:50000000, max:100000000,rate:12.5,maxleverage:4,marginAmount:2391300},
  {min:100000000, max:200000000,rate:15.0,maxleverage:3,marginAmount:4891300},
  {min:200000000, max:1000000000000,rate:25.0,maxleverage:2,marginAmount:24891300}];

const max100Contract =  [{min:0, max:10000,rate:0.5,maxleverage:100, marginAmount: 0},
  {min:10000, max:100000,rate:0.65,maxleverage:75,marginAmount: 15},
  {min:100000, max:500000,rate:1.0,maxleverage:50,marginAmount: 365},
  {min:500000, max:1000000,rate:2.5,maxleverage:25,marginAmount:5365},
  {min:1000000, max:2000000,rate:5.0,maxleverage:10,marginAmount:35365},
  {min:2000000, max:5000000,rate:10.0,maxleverage:5,marginAmount:135365},
  {min:5000000, max:10000000,rate:12.5,maxleverage:4,marginAmount:260365},
  {min:10000000, max:20000000,rate:15.0,maxleverage:3,marginAmount:510365},
  {min:20000000, max:1000000000000,rate:25.0,maxleverage:2,marginAmount:2510365}];

const max20Contract =  [{min:0, max:10000,rate:0.65,maxleverage:20, marginAmount: 0},
    {min:10000, max:25000,rate:1.00,maxleverage:15,marginAmount: 35},
    {min:25000, max:50000,rate:1.00,maxleverage:12,marginAmount: 35},
    {min:50000, max:100000,rate:2.00,maxleverage:10,marginAmount:535},
    {min:100000, max:200000,rate:2.00,maxleverage:9,marginAmount:535},
    {min:200000, max:250000,rate:2.00,maxleverage:8,marginAmount:535},
    {min:250000, max:500000,rate:5.00,maxleverage:7,marginAmount:8035},
    {min:500000, max:1000000,rate:5.00,maxleverage:6,marginAmount:8035},
    {min:1000000, max:2000000,rate:10.00,maxleverage:5,marginAmount:58035},
    {min:2000000, max:5000000,rate:12.50,maxleverage:4,marginAmount:108035},
    {min:5000000, max:10000000,rate:15.00,maxleverage:3,marginAmount:233035},
    {min:10000000, max:1000000000000,rate:25.00,maxleverage:2,marginAmount:1233035}];

const max75Contract=[{min:0, max:10000,rate:0.65,maxleverage:75,  marginAmount: 0},
  {min:10000, max:50000,rate:1.0,maxleverage:50,  marginAmount: 35},
  {min:50000, max:250000,rate:2.0,maxleverage:25,  marginAmount: 535},
  {min:250000, max:1000000,rate:5.0,maxleverage:10,  marginAmount: 8035},
  {min:1000000, max:2000000,rate:10.0,maxleverage:5,  marginAmount: 58035},
  {min:2000000, max:5000000,rate:12.5,maxleverage:4,  marginAmount: 108035},
  {min:5000000, max:10000000,rate:15.0,maxleverage:3,  marginAmount: 233035},
  {min:10000000, max:1000000000000,rate:25.0,maxleverage:2,  marginAmount: 1233035}];

const max50Contract=[{min:0, max:5000,rate:1.0,maxleverage:50,  marginAmount: 0},
  {min:5000, max:25000,rate:2.5,maxleverage:20, marginAmount: 75},
  {min:25000, max:100000,rate:5.0,maxleverage:10,  marginAmount: 700},
  {min:100000, max:250000,rate:10.0,maxleverage:5,  marginAmount: 5700},
  {min:250000, max:1000000,rate:12.5,maxleverage:2,  marginAmount: 11950},
  {min:1000000, max:1000000000000,rate:50.0,maxleverage:1,  marginAmount: 386950}];

const max75list = ['ADAUSDT','BNBUSDT','DOTUSDT','EOSUSDT','ETCUSDT','LINKUSDT','LTCUSDT','TRXUSDT','XLMUSDT','XMRUSDT','XRPUSDT','XTZUSDT','BCHUSDT']
const max20list = ['GRTUSDT','1INCHUSDT']
const style= {fontSize:"0.9rem", fontWeight:"600" }

const markBTC = {
  1: {style: style, label:"1✕"},
  25: {style: style, label:"25✕"},
  50: {style: style, label:"50✕"},
  75: {style: style, label:"75✕"},
  100: {style: style, label:"100✕"},
  '125': {style: style, label:"125✕"},
};
const markETH = {
  1: {style: style, label:"1✕"},
  20: {style: style, label:"20✕"},
  40: {style: style, label:"40✕"},
  60: {style: style, label:"60✕"},
  80: {style: style, label:"80✕"},
  100: {style: style, label:"100✕"},
};

const markLINK = {
  1: {style: style, label:"1✕"},
  15: {style: style, label:"15✕"},
  30: {style: style, label:"30✕"},
  45: {style: style, label:"45✕"},
  60: {style: style, label:"60✕"},
  75: {style: style, label:"75✕"},
};

const markJOB = {
  1: {style: style, label:"1✕"},
  10: {style: style, label:"10✕"},
  20: {style: style, label:"20✕"},
  30: {style: style, label:"30✕"},
  40: {style: style, label:"40✕"},
  50: {style: style, label:"50✕"},
}

const mark20 = {
  1: {style: style, label:"1✕"},
  4: {style: style, label:"4✕"},
  8: {style: style, label:"8✕"},
  12: {style: style, label:"12✕"},
  16: {style: style, label:"16✕"},
  20: {style: style, label:"20✕"},
}

const maxBTC=[
    {max:0, leverage:1},
    {max:0, leverage:2},
    {max:200000000, leverage:3},
    {max:100000000, leverage:4},
    {max:50000000, leverage:5},
    {max:20000000, leverage:10},
    {max:5000000, leverage:20},
    {max:1000000, leverage:50},
    {max:250000, leverage:100},
    {max:50000, leverage:125}
]

const maxETH=[
  {max:0, leverage:1},
  {max:0, leverage:2},
  {max:20000000, leverage:3},
  {max:10000000, leverage:4},
  {max:5000000, leverage:5},
  {max:2000000, leverage:10},
  {max:1000000, leverage:25},
  {max:500000, leverage:50},
  {max:100000, leverage:75},
  {max:10000, leverage:100}
]
const maxLINK=[
  {max:0, leverage:1},
  {max:0, leverage:2},
  {max:10000000, leverage:3},
  {max:5000000, leverage:4},
  {max:2000000, leverage:5},
  {max:1000000, leverage:10},
  {max:250000, leverage:25},
  {max:50000, leverage:50},
  {max:10000, leverage:75},
]

const max20 =[
  {max:0, leverage:1},
  {max:1000000, leverage:2},
  {max:250000, leverage:4},
  {max:100000, leverage:5},
  {max:25000, leverage:10},
  {max:5000, leverage:20}
]

const max50 = [
  {max:0, leverage:1},
  {max:1000000, leverage:2},
  {max:250000, leverage:5},
  {max:100000, leverage:10},
  {max:25000, leverage:20},
  {max:5000, leverage:50}
]



let intervaId = false;
let failCount = 0;
var toastnum =0;


function* hongData() {
  const test = yield call(callApi, 'none', 'test');
  const test2 = yield call(callApi, 'all', 'futureDaily2')
  let data =[]
  
  _.forEach(test, item =>{
    let a = test2[item.symbol];
    if(a !== undefined){
      data.push({
        symbol: item.symbol,
        lastFundingRate: parseFloat(parseFloat(item.lastFundingRate*100).toFixed(4)),
        markPrice: item.markPrice,
        lastPrice: parseFloat(a.lastPrice),
        openPrice: a.openPrice,
        priceChange: a.priceChange,
        priceChangePercent: parseFloat(a.priceChangePercent),
        weightedAvgPrice: a.weightedAvgPrice
      })
    }

  })
 
  yield put({
    type: 'hong/SET_MARK',
    payload: data
  })
}



function* initialApiData(action) {
  const info = yield call(callApi, 'none', 'exchangeInfo');
  const test = yield call(callApi, 'none', 'test');
  const test2 = yield call(callApi, 'all', 'futureDaily2')
  const getuserOptional = state => state.user.useOptional.optional
  const actives = yield select(getuserOptional)
  let data =[]
  
  if((test !== 'error' && test.code === undefined) && (test2 !== 'error' && test2.code === undefined)){
    _.forEach(test, item =>{
      let a = test2[item.symbol];
      var status= false;
      var b = actives.indexOf(item.symbol+",")
      if(b !==-1){
        status = true
      }
     
      if(a !== undefined){
        data.push({
          symbol: item.symbol,
          active:status,
          lastPrice: a.lastPrice,
          openPrice: a.openPrice,
          priceChange: a.priceChange,
          priceChangePercent: parseFloat(a.priceChangePercent),
        })
      }
    })
    yield put({
      type: 'websocket/GET_FUTURES_DAILY',
      dailys: data,
      actives: []
    })
  }

  let symbols = [];
  if(info !== 'error' && info.code === undefined){
  info.symbols.forEach(item => {
    symbols.push({
      symbol: item.symbol,
      minPrice: parseFloat(item.filters[0].tickSize),
      maxPrice: parseFloat(item.filters[0].maxPrice),
      minQty: parseFloat(item.filters[1].minQty),
      maxQty: parseFloat(item.filters[1].maxQty),
      pricePrecision: item.pricePrecision,
      quantityPrecision: item.quantityPrecision
    })
  })
  const a =info.symbols.find(item => item.symbol === action.payload)
  yield put({
    type: 'trade/SET_EXCHANGE_INFO',
    payload: {
      minPrice: parseFloat(a.filters[0].tickSize),
      maxPrice: parseFloat(a.filters[0].maxPrice),
      minQty: parseFloat(a.filters[1].minQty),
      maxQty: parseFloat(a.filters[1].maxQty),
      pricePrecision: a.pricePrecision,
      quantityPrecision: a.quantityPrecision,
      all: symbols
    }
  })
  if(action.payload === 'BTCUSDT'){
    yield put({
      type:"trade/SET_SYMBOL_MARK",
      payload:{
        mark: markBTC,
        max: maxBTC
      }
    })
  }else if(action.payload ==='ETHUSDT'){
    yield put({
      type:"trade/SET_SYMBOL_MARK",
      payload:{
        mark: mark20,
        max: max20
      }
    })
  }else if(action.payload === 'GRTUSDT' ||action.payload === '1INCHUSDT' ){
    yield put({
      type:"trade/SET_SYMBOL_MARK",
      payload:{
        mark: markETH,
        max: maxETH
      }
    })
  }else{
    let a = _.findIndex(max75list, function(o){
      return o === action.payload
    })
    if(a !== -1){
      yield put({
        type:"trade/SET_SYMBOL_MARK",
        payload:{
          mark: markLINK,
          max: maxLINK
        }
      })
    }else{
      yield put({
        type:"trade/SET_SYMBOL_MARK",
        payload:{
          mark: markJOB,
          max: max50
        }
      })
    }
  }
  // else if(action.payload === 'LINKUSDT'){
  //   yield put({
  //     type:"trade/SET_SYMBOL_MARK",
  //     payload:{
  //       mark: markLINK,
  //       max: maxLINK
  //     }
  //   })
  // }
  }

  const aggtrade = yield call(callApi, action.payload, 'aggtrade');

  const agg = yield call(getAgg1mdata, (action.payload).toLowerCase());

  if(agg !== 'error' && agg.data.status=== 'SUCCESS'){
    if( agg.data.message !== null){
      yield put({
        type: 'websocket/GET_AGG_TRADE_1M',
        message: agg.data.message,
      });
    }
  }
  if(aggtrade !=='error' && aggtrade.code === undefined){

    yield put({
      type: 'websocket/FETCH_INITIAL_DATA',
      payload: { aggtrade: aggtrade},
    });
    yield put({
      type: 'order/SET_PRICE',
      payload: aggtrade[0].p
    })
  }
  yield put({
    type: 'websocket/INITIALIZE_WEB_SOCKETS_CHANNEL',
  });
  yield put({
    type: "user/USER_AUTH_TOTAL",
    payload: "trading"
  })
}


function* reInitialApiData(action) {
  const getSymbolInfo = state => state.trade.ex;
  const getprevsymbol = state => state.trade.prevSymbol;
  const getPosition = state => state.user.userTraInfo.position
  const getOpenOrder = state => state.user.userTraInfo.openOrder
  const symbolInfos = yield select(getSymbolInfo);
  const prevsymbol = yield select(getprevsymbol);
  const positions = yield select(getPosition);
  const openOrders = yield select(getOpenOrder);
  const syminfo = symbolInfos.find(item => item.symbol === action.payload)
  yield put({
    type: 'trade/SET_NEW_EXCHANGE_INFO',
    payload: {
      minPrice: parseFloat(syminfo.minPrice),
      maxPrice: parseFloat(syminfo.maxPrice),
      minQty: parseFloat(syminfo.minQty),
      maxQty: parseFloat(syminfo.maxQty),
      pricePrecision: syminfo.pricePrecision,
      quantityPrecision: syminfo.quantityPrecision,
    }
  })
  var nowPosition = _.filter(positions, item => item.symbol === action.payload)
  var nowOpenOrder = _.filter(openOrders, item => item.symbol === action.payload)

  const aggtrade = yield call(callApi, action.payload, 'aggtrade');
  const agg = yield call(getAgg1mdata, (action.payload).toLowerCase());

  if(action.payload === 'BTCUSDT'){
    yield put({
      type:"trade/SET_SYMBOL_MARK",
      payload:{
        mark: markBTC,
        max: maxBTC
      }
    })
  }else if(action.payload ==='ETHUSDT'){
    yield put({
      type:"trade/SET_SYMBOL_MARK",
      payload:{
        mark: markETH,
        max: maxETH
      }
    })
  }else if(action.payload === 'GRTUSDT' ||action.payload === '1INCHUSDT'){
    yield put({
      type:"trade/SET_SYMBOL_MARK",
      payload:{
        mark: markETH,
        max: maxETH
      }
    })
  }else{
    let a = _.findIndex(max75list, function(o){
      return o === action.payload
    })
    if(a !== -1){
      yield put({
        type:"trade/SET_SYMBOL_MARK",
        payload:{
          mark: markLINK,
          max: maxLINK
        }
      })
    }else{
      yield put({
        type:"trade/SET_SYMBOL_MARK",
        payload:{
          mark: markJOB,
          max: max50
        }
      })
    }
  }
  // else if(action.payload === 'LINKUSDT'){
  //   yield put({
  //     type:"trade/SET_SYMBOL_MARK",
  //     payload:{
  //       mark: markLINK,
  //       max: maxLINK
  //     }
  //   })
  // }
  yield put({
    type: 'user/CHANGE_NOW_TRADING_INFO',
    payload:{
      openOrder: nowOpenOrder,
      position: nowPosition
    }
  })
  if(agg !== 'error' && agg.data.status=== 'SUCCESS'){
    if( agg.data.message !== null){
      yield put({
        type: 'websocket/GET_AGG_TRADE_1M',
        message: agg.data.message,
      });
    }
  }
  yield put({
    type: 'websocket/FETCH_INITIAL_DATA',
    payload: { aggtrade: aggtrade},
  });
  yield put({
    type: 'order/SET_PRICE',
    payload: aggtrade[0].p
  })
  yield put({ type: 'websocket/SUBSCRIBE_NEW_SYMBOL_WEBSOCKET' });
  yield put({ type: 'websocket/UNSUBSCRIBE_WEBSOCKET', payload: prevsymbol });
  yield put({type:"user/VIEW_TRUE"})
  yield put({type: "user/USER_AUTH_SIMPLE",})
}

async function getAgg1mdata(symbol) {
  try{
    const a = await axios.post(`/api/v2/recents/${symbol}`)
    return a;
  }catch(e){
    return 'error';
  
  }
}

async function callApi (symbol, type) {
  let returndata;

  switch (type) {
    case 'test': {
      try{
        returndata = await binance.futuresMarkPrice()
        return returndata;
      }catch(e){
        return 'error';
      }
    }
    case 'aggtrade': {
      try {
        returndata = await binance.futuresAggTrades(symbol, { limit: 150 });
        return returndata.reverse();
      } catch (e) {
        return 'error';
      }
    }
    case 'getUserStream': {
      clearUserDataInterval();
      try {
        returndata = await binance.futuresGetDataStream();
     
        if (returndata.listenKey) {
          intervaId = setInterval(
            () => callApi('none', 'keepUserStream'),
            3500000,
          );
          failCount = 0;
          return returndata.listenKey;
        }
      } catch (e) {
        return e;
      }
      break;
    }
    case 'keepUserStream': {
      try {
        returndata = await binance.futuresKeepDataStream();
      } catch (e) {
        failCount = failCount + 1;
        const msg = 'Failed Requesting keepAliveUserDataStream';
        if (e && e.code === -1125) {
          console.error(
            new Date(),
            msg,
            'listen key expired - clearing keepAlive interval',
            e,
          );
          clearUserDataInterval();
          return;
        }
        return;
      }
      break;
    }
    case 'closeUserStream':{
      try{
        returndata = await binance.futuresCloseDataStream();
      }catch(e){
        return 'error';
      }
      break;
    }
    case 'getOpenOrder': {
      try {
        returndata = await binance.futuresOpenOrders();

        return returndata;
      } catch (e) {
        return 'error';
      }
    }
    case 'getPositon': {
      try {
        returndata = await binance.futuresPositionRisk();
      
        return returndata;
      } catch (e) {
        return 'error';
      }
    }
    case 'getAccount': {
      try {
        returndata = await binance.futuresAccount();
     
        return returndata;
      } catch (e) {
        return 'error';
      }
    }
    case 'CROSSED': {
      try {
        returndata = await binance.futuresMarginType(symbol, 'CROSSED');
        return returndata;
      } catch (e) {
        return 'error';
      }
    }
    case 'ISOLATED': {
      try {
        returndata = await binance.futuresMarginType(symbol, 'ISOLATED');
        return returndata;
      } catch (e) {
        return 'error';
      }
    }
    case 'openInterest': {
      try {
        returndata = await binance.futuresOpenInterest(symbol);
        return returndata;
      } catch (e) {
        return 'error';
      }
    }
    case 'futureDaily': {
      try {
        returndata = await binance.futuresDaily(symbol);
        return returndata;
      } catch (e) {
        return 'error';
      }
    }
    case 'futureDaily2':{
      try {
        returndata = await binance.futuresDaily();
        return returndata;
      } catch (e) {
        return 'error';
      }
    }
    case 'income': {
      try {
        returndata = await binance.futuresIncome({limit:1000, startTime:symbol });
        return returndata;
      } catch (e) {
        return 'error';
      }
    }
    case 'exchangeInfo':{
      try{
        returndata = await binance.futuresExchangeInfo()
       
        return returndata;
      }catch(e){
        return 'error';
      }
    }
    case 'candleDate':{
      try{
        returndata = await binance.futuresCandless(symbol, '1h', {limit:24})
        
        let a = [];
        _.forEach(returndata, item =>{
          a.push(parseFloat(item[4]))
        })
        
        return a
      }catch(e){
        return 'error';
      }
    }
    default:{
      return 
    }
  }
}

async function callLeverageApi (symbol, leverage) {
  try {
    const returndata = await binance.futuresLeverage(symbol, leverage);
    return returndata;
  } catch (e) {
    return 'error';
  }
}

function clearUserDataInterval () {
  if (intervaId) {
    clearInterval(intervaId);
  }
  intervaId = false;
  failCount = 0;
}

function * balanceUserApi () {
  const getUserInfo = state => state.user.userInfo;
  const userInfo = yield select(getUserInfo);

  if(userInfo.key[0] !== ''){
    binance.options({
    useServerTime: true,
    APIKEY: encryption.Decrypt(userInfo.key[0]),
    APISECRET: encryption.Decrypt(userInfo.key[1])
    })
    const account = yield call(callApi, 'none', 'getAccount');
    if(account === 'error'){

    }else if (account.msg !== undefined) {
      yield put({
        type: 'user/SET_USER_CHECK',
        payload: {
          isApi: 'invalid',
        },
      });
    } else {
      yield put({
        type: 'user/SET_USER_CHECK',
        payload: {
          isApi: 'valid',
        },
      });
      yield put({ type: 'user/SET_USER_ASSETS', asset: account.assets, position: account.positions });
      yield put({type: 'user/SET_USER_BALANCE', asset:account.assets, wallet: account.totalWalletBalance, available: account.availableBalance, unRealPnl: account.totalUnrealizedProfit  })
      yield call(getIncome)
    
    }
  }else {
    yield put({
      type: 'user/SET_USER_CHECK',
      payload: {
        isApi: 'none',
      },
    });
  }
 
}

function * setUserApi () {
  const getuserInfo = state => state.user.userInfo;
  const getExchangeInfo = state => state.trade.ex;
  const getSymbol = state => state.trade.symbol;
  const exchangeInfo = yield select(getExchangeInfo);
  const userInfo = yield select(getuserInfo);
  const symbol = yield select(getSymbol);
  
  if(userInfo.isMem ==='Free' || userInfo.isMem === 'Basic'){
    binance.options({
      APIKEY: encryption.Decrypt(userInfo.key[0]),
      APISECRET: encryption.Decrypt(userInfo.key[1]),
      useServerTime: true,
    });
    const account = yield call(callApi, 'none', 'getAccount');
    if(account === 'error'){

    }else if(account === 'Invalid API Key' || account === 'Invalid API Secret'){
      yield put({
        type: 'user/SET_USER_STATUS',
        payload: "noneapi"
      });
    }else if(account.code === -2015 || account.code === -2014 || account.code === -1022){
      // -2014  format invalid  -2015 Invalid API-key, IP, or permissions for action.
      // -1022 Signature for this request is not valid. 
      yield put({
        type: 'user/SET_USER_STATUS',
        payload: "apiinvalid"
      });
    } else if(account.code === -1021){
      //Timestamp error
     
    }  else if (account.canTrade === undefined ||!account.canTrade){
      yield put({
        type: 'user/SET_USER_STATUS',
        payload: "cannottrade"
      });
      //account can not trade
    } else if(account.canTrade){
     // available api
      const openOrder = (yield call(callApi, 'none', 'getOpenOrder')).reverse();
      const position = yield call(callApi, 'none', 'getPositon');
      const test = yield call(callApi, 'none', 'test');
      
      if(test !== 'error' && test.code === undefined && position !=='error' && position.code === undefined && openOrder !=='error' && openOrder.code === undefined){
        const a = arrangePosition(position,test,exchangeInfo);
        const active = _.filter(openOrder, item => item.type === 'LIMIT');
        const stop = _.filter(
          openOrder,
          item => item.type !== 'LIMIT' && item.type !== 'MARKET',
        );
        var h = _.filter(a, item => parseFloat(item.positionAmt)!==0)
        const nowOpenOrder = _.filter(openOrder, item => item.symbol === symbol);
        const nowPosition = _.filter(a, item => item.symbol ===symbol)
        const ordermargin = yield call(calcOpenOrderMargin, active, position); //activemargin
        const marginInfo = yield call(calcMarginInfo, a, ordermargin, account.assets[0].walletBalance,symbol )
        yield put({
          type: 'user/SET_USER_TRADING_INFO',
          payload: {
            margin: [{asset: account.assets[0].asset, walletBalance: account.assets[0].walletBalance},{asset: account.assets[1].asset, walletBalance: account.assets[1].walletBalance}],//account.assets, 
            position: a,
            openorder: openOrder,
            active: active,
            stop: stop,
            nowPosition: nowPosition,
            nowOpenOrder: nowOpenOrder,
            pl: h.length,
            al: active.length,
            sl: stop.length
          },
        });
        yield put({
          type: 'user/GET_OPENORDER_MARGIN',
          payload: { activemargin: ordermargin },
        });
        yield put({
          type: 'user/SET_USER_ACCOUNT_INFO',
          payload:{
            symbolPosition: marginInfo.nowSymbolPositon,
            walletBalance: account.assets[0].walletBalance,
            positions: marginInfo.positions,
            isolatedMargin: marginInfo.isolatedMargin,
            crossPositionValue: marginInfo.crossPositionValue,
            crossWallet: marginInfo.crossWallet,
            crossMaintMargin: marginInfo.crossMaintMargin,
            positionInitialMargin: marginInfo.positionInitialMargin,
            openOrderInitialMargin: marginInfo.openOrderInitialMargin,
            crossedUnPnl: marginInfo.crossedUnPnl,
            unRealizedPnl: marginInfo.unrealizedPnl, 
            maintAmount: marginInfo.maintAmount,
            availableBalance: Math.max(0,account.assets[0].walletBalance-marginInfo.positionInitialMargin-marginInfo.openOrderInitialMargin+marginInfo.crossedUnPnl)
          }
        })
        const listenKey = yield call(callApi, 'none', 'getUserStream');
        if(listenKey !== 'error' && listenKey.code === undefined){
          yield put({ type: 'websocket/START_USER-DATA_STREAM', payload: listenKey });
          yield put({
            type: 'user/SET_USER_STATUS',
            payload: "cantrade"
          });
        }
      }
    }else{
      //dont know error
    }
  }else{
    yield put({
      type: 'user/SET_USER_STATUS',
      payload: "notmember"
    });
  }

}

function calcMarginInfo(position, orderMargin, walletBalance,symbol) {
  let positionInfo =[];
  let isolatedMargin =0;
  let crossedUnPnl =0;
  let isolatedUnPnl = 0;
  let allpositionMargin = 0;
  let allactiveMargin =0;
  let maintInfo = {};
  let maintAmount = 0;
  var isolatedWalletMargin=0;
  let maintMargin =0;
  let crossMaintMargin = 0;
  let openOrderMargin=0;
  let rate =0;
  let crossPositionValue = 0;
  let nowSymbolPositon = {}
  _.forEach(position, (item) => {
      let levValue = Math.ceil((1/item.leverage)*10000)/10000;
      let a = orderMargin.find(function(o){
          return o.symbol === item.symbol
      })
      let positionMargin = levValue*Math.abs(item.positionAmt)*item.markPrice
      let unRealizedPNL = parseFloat((item.markPrice - item.entryPrice)*item.positionAmt)
      isolatedMargin += parseFloat(item.isolatedMargin);
      if(Math.abs(item.positionAmt)>0){
          if(item.marginType === 'cross'){
              maintInfo = getMaintMargin(item);
              allpositionMargin += positionMargin
              crossedUnPnl += unRealizedPNL
              maintMargin= maintInfo.maintmargin
              maintAmount += maintInfo.maintamount
              crossMaintMargin += maintInfo.maintmargin
              rate = maintInfo.rate
              crossPositionValue += Math.abs(item.positionAmt)*item.markPrice;
              //crossPositionMargin += positionMargin
          }else if(item.marginType === 'isolated'){
              maintInfo = getMaintMargin(item);
              allpositionMargin += item.isolatedMargin
              isolatedWalletMargin+= item.isolatedMargin
              isolatedUnPnl += unRealizedPNL
              maintMargin= maintInfo.maintmargin
              maintAmount += maintInfo.maintamount
              rate = maintInfo.rate
          }
      }
      if(parseFloat(item.positionAmt)>=0){
          if(positionMargin*2+a.buy>a.sell){
              openOrderMargin = a.buy
              allactiveMargin += a.buy 
          }else{
              openOrderMargin = a.sell - positionMargin*2;
              allactiveMargin += a.sell - positionMargin*2;
          }
      }else {
          if(positionMargin*2+a.sell>a.buy){
              openOrderMargin = a.sell
              allactiveMargin += a.sell
          }else{
              openOrderMargin = a.buy - positionMargin*2;
              allactiveMargin += a.buy - positionMargin*2;
          }
      }
      positionInfo.unshift({symbol: item.symbol, entryPrice: item.entryPrice, positionAmt: item.positionAmt, markPrice: item.markPrice,maxNotionalValue:item.maxNotionalValue,leverage: item.leverage,rate: rate, marginType: item.marginType, isolatedMargin: item.isolatedMargin, liquidationPrice: item.liquidationPrice, positionMargin:positionMargin, maintMargin: maintMargin, openOrderMargin: openOrderMargin, unRealizedPNL : unRealizedPNL,pricePrecision: item.pricePrecision,quantityPrecision: item.quantityPrecision })
  }) 

  _.forEach(positionInfo, item => {
      if(item.marginType === 'cross' && Math.abs(item.positionAmt)>0){
        let a = parseFloat((1*walletBalance - isolatedMargin - (crossMaintMargin - item.maintMargin)+(crossedUnPnl - item.unRealizedPNL) + (maintAmount - item.positionAmt*item.entryPrice))/(item.rate*Math.abs(item.positionAmt)/100 -1*item.positionAmt)).toFixed(item.pricePrecision)
        if(a >0){
          item.liquidationPrice = a
        }else{
          item.liquidationPrice = 0
        }
         
      }else if(item.marginType ==="isolated" && Math.abs(item.positionAmt)>0){
        var a = parseFloat((1*isolatedWalletMargin + (maintAmount - item.positionAmt*item.entryPrice))/(item.rate*Math.abs(item.positionAmt)/100 -1*item.positionAmt)).toFixed(item.pricePrecision)
        //var a = parseFloat(((item.maintMargin-item.isolatedMargin)/item.positionAmt)+parseFloat(item.entryPrice)).toFixed(item.pricePrecision)
        if(a >0){
          item.liquidationPrice = a
        }else{
          item.liquidationPrice = 0
        }
      }
      if(item.symbol === symbol ){
        nowSymbolPositon = item;
      }
  })
 return {positions: positionInfo, isolatedMargin: isolatedMargin,crossPositionValue: crossPositionValue,crossWallet: 1*walletBalance-isolatedMargin+crossedUnPnl, crossMaintMargin: crossMaintMargin, positionInitialMargin: allpositionMargin, openOrderInitialMargin: allactiveMargin, crossedUnPnl: crossedUnPnl, unrealizedPnl: crossedUnPnl+ isolatedUnPnl,maintAmount: maintAmount, nowSymbolPositon:nowSymbolPositon }
}



function calcOpenOrderMargin (active, position) {
  let activeMargin = [];
  let levValue = 0;
  _.forEach(position, (item, index) => {
    activeMargin[index] = { symbol: item.symbol, buy: 0, sell: 0 };
  });

  _.forEach(active, item => {
    let inde = _.findIndex(activeMargin, function (o) {
      return o.symbol === item.symbol;
    });
    levValue = Math.ceil((1 / position[inde].leverage) * 10000) / 10000;
    if (item.side === 'BUY') {
      activeMargin[inde].buy +=
        levValue * item.price * (item.origQty - item.cumQuote);
    } else if (item.side === 'SELL') {
      activeMargin[inde].sell +=
        levValue * item.price * (item.origQty - item.cumQuote);
    }
  });

  return activeMargin;
}


function getMaintMargin (position){
  if(position.symbol ==='BTCUSDT'){
    return calcMaintMargin(1, position);
  }else if(position.symbol === 'ETHUSDT'){
    return calcMaintMargin(2,position)
  }else if(position.symbol === 'GRTUSDT' || position.symbol ==='1INCHUSDT'){
    return calcMaintMargin(3, position)
  }else{
    let a = _.findIndex(max75list, function(o){
      return o === position.symbol
    })
    if(a !==-1){
      return calcMaintMargin(4, position);
    }else {
      return calcMaintMargin(5, position);
    }
  }
} 

function calcMaintMargin (contract, position){
  var maxcont = [];
  var myNotionalValue = position.entryPrice*Math.abs(position.positionAmt);
  var maintmargin =0;
  var lastValue = myNotionalValue;
  var check = true;
  var num = 0;
  var rate = 0;
  var maintamount = 0;
  if(contract ===1){
    maxcont = max125Contract;
  }else if(contract === 2){
    maxcont = max100Contract;
  }else if(contract === 3){
    maxcont = max20Contract;
  }else if(contract === 4){
    maxcont = max75Contract
  }else {
    maxcont = max50Contract;
  }
//   max = _.findIndex(maxcont, function(o){
//       return o.max === parseFloat(position.maxNotionalValue)
//   })
  while(check){
    if(maxcont[num].max>=myNotionalValue){
      check = false;
      maintmargin += (lastValue*maxcont[num].rate)/100;
      rate = maxcont[num].rate;
    }else{
      lastValue =- (maxcont[num].max-maxcont[num].min);
      maintmargin += (maxcont[num].max-maxcont[num].min)*maxcont[num].rate/100;
      num++;
    }
  }
  maintamount= maxcont[num].marginAmount
  return {maintmargin:maintmargin,maintamount:maintamount,rate:rate};
}

function getIsolatedMaintMargin (position){
  var cont = [];
  var check = true;
  var num = 0;
  var maintmargin =0;
  var myNotionalValue = position.entryPrice*Math.abs(position.positionAmt);
  var lastValue = myNotionalValue;
  if(position.symbol === 'BTCUSDT'){
    cont = max125Contract;
  }else if(position.symbol === 'ETHUSDT'){
    cont = max100Contract;
  }else{
    let a =_.findIndex(max75list, function(o){
      return o === position.symbol
    })
    if(a !== -1){
        cont = max75Contract
    }else{
      if(position.symbol ==='GRTUSDT' || position.symbol === '1INCHUSDT'){
        cont = max20Contract
      }else{
        cont = max50Contract
      }
      
    }
  }

  while(check){
    if(cont[num].max>=myNotionalValue){
      check = false;
      maintmargin += (lastValue*cont[num].rate)/100;
    }else{
      lastValue =- (cont[num].max-cont[num].min);
      maintmargin += (cont[num].max-cont[num].min)*cont[num].rate/100;
      num++;
    }
  }

  return maintmargin;
}

function* getKlineDate() {
  const btckline = yield call(callApi, 'BTCUSDT', 'candleDate')
  const ethkline = yield call(callApi, 'ETHUSDT', 'candleDate')
  const linkline = yield call(callApi, 'LINKUSDT', 'candleDate')
  const btcdaily = yield call(callApi, 'BTCUSDT', 'futureDaily')
  const ethdaily = yield call(callApi, 'ETHUSDT', 'futureDaily')
  const linkdaily = yield call(callApi, 'LINKUSDT', 'futureDaily')
  if(btckline !== 'error' && ethkline !=='error' && linkline !=='error' &&btcdaily !=='error' && ethdaily !=="error" && linkdaily !=='error'){
  let a ={
    labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  datasets: [
    {
      fill: true,
      lineTension: 0.1,
      backgroundColor:"#f8f6f6", // 'rgba(75,192,192,0.4)',
      borderColor:  "#ecebeb",//'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#ecebeb',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 1,
       pointHitRadius: 1,
      data: btckline,
    }]
  }
  let b ={
    labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  datasets: [
    {
      fill: true,
      lineTension: 0.1,
      backgroundColor:"#f8f6f6", // 'rgba(75,192,192,0.4)',
      borderColor:  "#ecebeb",//'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#ecebeb',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 1,
       pointHitRadius: 1,
      data: ethkline,
    }]
  }
  let c ={
    labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  datasets: [
    {
      fill: true,
      lineTension: 0.1,
      backgroundColor:"#f8f6f6", // 'rgba(75,192,192,0.4)',
      borderColor:  "#ecebeb",//'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: '#ecebeb',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 1,
       pointHitRadius: 1,
      data: linkline,
    }]
  }

  yield put({
    type: 'api/SET_HOME_KLINE_DATA',
    payload:{
      btc: a,
      eth: b,
      link: c,
      btchl:[btcdaily.highPrice,btcdaily.lowPrice],
      ethhl:[ethdaily.highPrice,ethdaily.lowPrice],
      linkhl:[linkdaily.highPrice,linkdaily.lowPrice]
    }
  })
  }
}


function * changeMarginMode (action) {
  const a = yield call(callApi,action.payload.symbol, action.payload.mode);
  if(a.msg ==="success"){
    //success
    toastnum++;
    yield put({
      type:"user/UPDATE_USER_TOAST_API",
      payload:{
        num:toastnum,
        status:"MMSUCCESS",
        message: ""
      }
    })
    
  }else{
    //fail
  }
}

function * getOpenInterestInterval (action) {
  const a = yield call(callApi, action.payload, 'openInterest');
  if(a !== 'error' && a.code === undefined){
    yield put({ type: 'api/SET_OPENINTEREST', payload: a });
  }
}



function * getIncome () {
 
  let income = [];
  let now = 1565758258000; 
  let tranId = 0;
  let nowincome  = yield call(callApi, now, 'income');

  if(nowincome !== 'error' && nowincome.code === undefined){
  nowincome.reverse()
  income = income.concat(nowincome);

  if(nowincome.length ===1000){
    now = nowincome[0].time;
    tranId = nowincome[0].tranId; 
  }
 
  while(nowincome.length === 1000){
    nowincome = yield call(callApi, now, 'income')
    
    let ca = _.findIndex(nowincome, function(o){
      return o.tranId === tranId
    })
  
    let nowincome2 = nowincome.slice(ca+1, 1000);
    nowincome2.reverse();
    nowincome.reverse();
    now = nowincome[0].time;
    tranId = nowincome[0].tranId; 
    income=nowincome2.concat(income);
    yield delay(51);
    }
  let incomelists = [];
  let transferlists = [];
  let nowdate = ''
  let nowdateTrans = ''
  let contactlist = [];
  let incomes = [];
  let timestamps = 0;
  let deposit = 0;
  let withdraw = 0;
  let timestamp =0;
  _.forEach(income, (item,index) =>{
    if(item.asset === 'USDT' && (item.incomeType ==="COMMISSION_REBATE" || item.incomeType ==="COMMISSION" || item.incomeType === "REALIZED_PNL" || item.incomeType === "FUNDING_FEE")){
    let a = new Date(item.time).toISOString().substring(0,10);
    if(nowdate ===''){
      nowdate = a;
     
        contactlist.push(item.symbol);
        incomes.push({symbol: item.symbol, income: 1*item.income})
        timestamps = item.time;
    }else{
      if(nowdate !== a){
        incomelists.push({date: nowdate, timestamp: timestamps, incomes: incomes })
        incomes=[];
        contactlist=[];
        nowdate = a;
        
       
          contactlist.push(item.symbol);
          incomes.push({symbol: item.symbol, income: 1*item.income})
          timestamps = item.time;
      }else{
          let symbolindex = _.findIndex(contactlist, function (o) {
            return o === item.symbol;
          });
          if(symbolindex === -1){
            contactlist.push(item.symbol);
            incomes.push({symbol: item.symbol, income: 1*item.income})
          }else{
            incomes[symbolindex].income += 1*item.income;
          }
          timestamps = item.time;
      }
    }
  }else if(item.asset === 'USDT' && item.info ==="TRANSFER"){
    let b = new Date(item.time).toISOString().substring(0,10);
    if(nowdateTrans ===''){
      nowdateTrans = b;
      if(parseFloat(item.income)>0){
        deposit += 1*item.income;
      }else {
        withdraw -= 1*item.income;
      }
      timestamp = item.time
      
    }else{
      if(nowdateTrans !== b){
        transferlists.push({date: nowdateTrans, timestamp: timestamp, deposit: deposit,withdraw: withdraw})
        deposit =0;
        withdraw =0;
        nowdateTrans =b;
        if(parseFloat(item.income)>0){
          deposit += 1*item.income;
        }else {
          withdraw -= 1*item.income;
        }
        timestamp = item.time;
        
      }else{
        if(parseFloat(item.income)>0){
          deposit += 1*item.income;
        }else {
          withdraw -= 1*item.income;
        }
        timestamp = item.time;
       
      }
    }
  }
  if(index+1 === income.length){
    incomelists.push({date: nowdate, timestamp: timestamps, incomes: incomes})
    transferlists.push({date: nowdateTrans, timestamp: timestamp, deposit: deposit,withdraw: withdraw})
  }

  })


  yield put({type: 'user/SET_USER_INCOME', payload: {
    income:incomelists, transfer: transferlists}
  })
}
}

function * changeLeverge (action) {
  const a = yield call(callLeverageApi, action.payload.symbol, action.payload.leverage);

  if(a === 'error'){
  }else if(a.code !==undefined){
    toastnum++;
    yield put({
      type:"user/UPDATE_USER_TOAST_API",
      payload:{
        num:toastnum,
        status:"NOTITLE",
        message: a.msg
      }
    })
  }else{
    const getPosition = state => state.user.userTraInfo.position;
    const position = yield select(getPosition);
    const position2 = position.map(item =>
      item.symbol === a.symbol
        ? { ...item, leverage: a.leverage, maxNotionalValue: a.maxNotionalValue }
        : item,
    );
    const nowPosition = _.filter(position2,item => item.symbol === a.symbol)
    yield put({ type: 'user/CHANGE_SYMBOL_LEVERAGE', 
      payload: {positions: position2, nowPosition: nowPosition}
    });

    toastnum++;
    yield put({
      type:"user/UPDATE_USER_TOAST_API",
      payload:{
        num:toastnum,
        status:"LSUCCESS",
        message: ''
      }
    })
  }

}

async function cancelOrder (symbol, orderId) {
  try {
    const returndata = await binance.futuresCancel(symbol, {
      orderId: orderId,
    });
    return returndata;
  } catch (e) {
    return 'error'
    // return e;
  }
}

function * cancelOpenOrder (action) {
  const a = yield call(
    cancelOrder,
    action.payload.symbol,
    action.payload.orderId,
  );
}


async function cancelReachOrders (action) {
  try{
    const a = await axios.post('/api/v2/reservations/reach', {
      Symbol: action.payload.symbol,
      ClientId: action.payload.clientId,
    });
    return a
  }catch(e){
    return "error"
  }
}

async function cancelCloseOrders (action) {
  try{
    const a = await axios.post('/api/v2/reservations/close', {
      Symbol: action.payload.symbol,
      ClientId: action.payload.clientId,
    });
    return a
  }catch(e){
    return "error"
  }
}

async function cancelAllReserveOrders (){
  try{
    const a = await axios.post('/api/v2/reservations/all', {
      Symbol: 'ALL'
    })
    return a
  }catch(e){
    return "error"
  }
}

function * cancelReach (action) {

  const a = yield call(cancelReachOrders, action);
  if(a === "error"){

  }else if (a.data.message === 'Successfully canceled') {
    yield put({ type: 'user/DELETE_RESERVE_ORDER', payload: a.data.clientId });
          toastnum++;
          yield put({
            type:"user/UPDATE_USER_TOAST_WEBSOCKET",
            payload:{
              num:toastnum,
              status:'CANCELED',
              side:action.payload.side,
              type: action.payload.type
            }
          })
  }else if(a.data.message ==="Already deleted"){
    yield put({ type: 'user/DELETE_RESERVE_ORDER', payload: action.payload.clientId });
    
  }
}

function * cancelClose (action) {

  const a = yield call(cancelCloseOrders, action);
  if(a === 'error'){

  }else if (a.data.message === 'Successfully canceled') {
    yield put({ type: 'user/DELETE_RESERVE_ORDER', payload: a.data.clientId });
    toastnum++;
          yield put({
            type:"user/UPDATE_USER_TOAST_WEBSOCKET",
            payload:{
              num:toastnum,
              status:'CANCELED',
              side:action.payload.side,
              type: action.payload.type
            }
    })
  }else if(a.data.message ==="Already deleted"){
    yield put({ type: 'user/DELETE_RESERVE_ORDER', payload: action.payload.clientId });
  }
}

function* cancelAll(){
  const a = yield call(cancelAllReserveOrders);
  if(a ==='error'){

  }else {
    if(a.data.status === 'SUCCESS'){
      yield put ({
        type:"user/DELETE_ALL_RESERVE_ORDER"
      })
    }else if(a.data.status === 'FAILURE'){
      document.location.href = '/';
    }
  }
}

async function futureLimitOrder (symbol,price,amount,side,isReduce,isPost) {
  var timeInForce;
  if(isPost){
    timeInForce = 'GTX'
  }else{
    timeInForce = 'GTC'
  }
  if (side === 'buy') {
    try {
      const a = await binance.futuresBuy(
        symbol,
        amount,
        price,
        {
          reduceOnly: isReduce,
          timeInForce: timeInForce,
          // newClientOrderId: action.payload.clientId,
        },
      );
      return a;
    } catch (e) {
      return 'error';
    }
  } else {
    try {
      const a = await binance.futuresSell(
        symbol,
        amount,
        price,
        {
          reduceOnly: isReduce,
          timeInForce: timeInForce,
          // newClientOrderId: action.payload.clientId,
        },
      );
      return a;
    } catch (e) {
      return 'error';
    }
  }
}

async function futureMarketOrder (symbol,amount, side, isReduce) {

  if (side === 'buy') {
    try {
      const a = await binance.futuresMarketBuy(
        symbol,
        amount,
        {reduceOnly: isReduce},
      );
      return a;
    } catch (e) {
      return 'error'
    }
  } else if(side==='sell'){
    try {
      const a = await binance.futuresMarketSell(
        symbol,
        amount,
        {reduceOnly: isReduce},
      );
      return a;
    } catch (e) {
      return 'error'
    }
  }


}

async function futureStopOrder (type,side, symbol, triger, trigerprice, price, amount, isReduce){
  
  if(type ==='STOP' || type ==='TAKE_PROFIT'){
    try{
      const a = await binance.futuresStop(side,type,symbol,amount,trigerprice,triger,price, {
        reduceOnly: isReduce,
        // newClientOrderId: action.payload.clientId,
      })
      return a
    }catch(e){
      return 'error'
     
    }
    
  }else if(type ==='STOP_MARKET' || type ==='TAKE_PROFIT_MARKET'){
    try{
      const a = await binance.futuresStopMarket(side,type,symbol,amount,trigerprice,triger,{
        reduceOnly: isReduce,
        // newClientOrderId: action.payload.clientId,
      })
      return a
    }catch(e){
      return 'error'
     
    }
   
  }
}

async function futureReachReserve(symbol,workingType,isReduce,side,reach, triger,price, amount){
  try{
    const a = await axios.post(`/api/v2/reservations/reach/${symbol.toLowerCase()}`,
    {
      WorkingType: workingType,
      ReduceOnly: isReduce,
      Symbol: symbol,
      Side: side.toUpperCase(),
      ReachedPrice: reach,
      OrderPrice: price,
      TriggerPrice: triger,
      Quantity: amount
    })
    return a
  }catch(e){
    return 'error';
  }
}

async function futureCloseReserve(symbol,kline,direction,isReduce,side,base,price, amount){
  try{
    const a = await axios.post(`/api/v2/reservations/close/${symbol.toLowerCase()}`,
    {
      Symbol: symbol,
      UpDown: direction,
      ReduceOnly: isReduce,
      TriggerPrice: base,
      OrderPrice: price,
      Side: side.toUpperCase(),
      Kline: kline,
      Quantity: amount
    })
    return a
  }catch(e){
    return 'error';
  }
}


function * summitOrder (action) {
//limit? stop? reserve?
//isMarket? price?
//amount
//side
if(parseFloat(action.payload.amount)!==0){
var result;
var working;
if(action.payload.type ==='Limit'){
  
  if(action.payload.isMarket){
     result = yield call(futureMarketOrder,action.payload.symbol, action.payload.amount, action.payload.side, action.payload.isReduce)
  }else {
     result = yield call(futureLimitOrder,action.payload.symbol,action.payload.price, action.payload.amount, action.payload.side, action.payload.isReduce,action.payload.isPost)
  }

  if(result ==='error'){

  }else{
    toastnum++;
    if(result.code !==undefined){
     
      yield put({
        type:"user/UPDATE_USER_TOAST_API",
        payload:{
          num:toastnum,
          status:"FAILURE",
          message: result.msg
        }
      })
    }else{
     
      yield put({
        type:"user/UPDATE_USER_TOAST_API",
        payload:{
          num:toastnum,
          status:"SUCCESS",
          message: ""
        }
      })
      yield put({
      type:'order/CHANGE_PERCENT',
              payload:{
                  amount :'',
                  value: ''
            }
      })
    }
  }
  
}else if(action.payload.type ==='stop'){
 
  if(action.payload.trigerprice === 'last Price'){
    const getAggtrade = state => state.websocket.aggtrade.slice(0,1)
    const aggtrade = yield select(getAggtrade);
    working = 'CONTRACT_PRICE'
    if(aggtrade.length){
      if(aggtrade[0].p>action.payload.triger){
        //스탑가격이 현재가격보다 작다. 이때 sell은 스탑, buy는 테이크 프로핏
        if(action.payload.isMarket){
          if(action.payload.side ==='sell'){
             result = yield call(futureStopOrder, 'STOP_MARKET','SELL',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
          }else if(action.payload.side ==='buy'){
             result = yield call(futureStopOrder, 'TAKE_PROFIT_MARKET','BUY',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
          }
        }else{
          if(action.payload.side ==='sell'){
             result = yield call(futureStopOrder, 'STOP','SELL',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
          }else if(action.payload.side ==='buy'){
             result = yield call(futureStopOrder, 'TAKE_PROFIT','BUY',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
          }
        }
      }else{
        if(action.payload.isMarket){
          if(action.payload.side ==='buy'){
             result = yield call(futureStopOrder, 'STOP_MARKET','BUY',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
          }else if(action.payload.side ==='sell'){
             result = yield call(futureStopOrder, 'TAKE_PROFIT_MARKET','SELL',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
          }
        }else{
          if(action.payload.side ==='buy'){
             result = yield call(futureStopOrder, 'STOP','BUY',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
          }else if(action.payload.side ==='sell'){
             result = yield call(futureStopOrder, 'TAKE_PROFIT','SELL',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
          }
        }
      }
    }
  }else if(action.payload.trigerprice ==='mark price'){
    working = 'MARK_PRICE'
    if(action.payload.mark>action.payload.triger){
      if(action.payload.isMarket){
        if(action.payload.side ==='sell'){
           result = yield call(futureStopOrder, 'STOP_MARKET','SELL',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
        }else if(action.payload.side ==='buy'){
           result = yield call(futureStopOrder, 'TAKE_PROFIT_MARKET','BUY',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
        }
      }else{
        if(action.payload.side ==='sell'){
           result = yield call(futureStopOrder, 'STOP','SELL',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
        }else if(action.payload.side ==='buy'){
           result = yield call(futureStopOrder, 'TAKE_PROFIT','BUY',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
        }
      }
    }else{
      if(action.payload.isMarket){
        if(action.payload.side ==='buy'){
           result = yield call(futureStopOrder, 'STOP_MARKET','BUY',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
        }else if(action.payload.side ==='sell'){
           result = yield call(futureStopOrder, 'TAKE_PROFIT_MARKET','SELL',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
        }
      }else{
        if(action.payload.side ==='buy'){
           result = yield call(futureStopOrder, 'STOP','BUY',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
        }else if(action.payload.side ==='sell'){
           result = yield call(futureStopOrder, 'TAKE_PROFIT','SELL',action.payload.symbol, action.payload.triger, working, action.payload.price, action.payload.amount, action.payload.isReduce)
        }
      }
    }
  }

  if(result ==='error'){

  }else{
    toastnum++;
    if(result.code !==undefined){
    
      yield put({
        type:"user/UPDATE_USER_TOAST_API",
        payload:{
          num:toastnum,
          status:"FAILURE",
          message: result.msg
        }
      })
    }else{
     
      yield put({
        type:"user/UPDATE_USER_TOAST_API",
        payload:{
          num:toastnum,
          status:"SUCCESS",
          message: ""
        }
      })
      yield put({
        type:'order/CHANGE_PERCENT',
                payload:{
                    amount :'',
                    value: ''
              }
        })
    }
  }
  

}else if(action.payload.type === "reservation"){
  var price
  var respon
  if(action.payload.isMarket){
    price = 'MARKET'
  }else {
    price = action.payload.price
  }
  if(action.payload.isKline){
    if(action.payload.klineDirection ==='up'){
      working = 'up';
    }else {
      working = 'down';
    }

     respon = yield call(futureCloseReserve,action.payload.symbol, action.payload.kline,working,action.payload.isReduce,action.payload.side,action.payload.base,price,action.payload.amount );
   
  }else{
    if(action.payload.trigerprice ==="last Price"){
      working = false
    }else{
      working =true
    }

    respon = yield call(futureReachReserve,action.payload.symbol, working,action.payload.isReduce,action.payload.side,action.payload.reach,action.payload.triger,price,action.payload.amount );
    
  }

  if(respon ==='error'){

  }else if(respon.data.message ==="Successfully reserved"){
    toastnum++;
    yield put({
      type: 'user/ADD_USER_RESERVE_ORDER',
      order: respon.data.reservation,
      // id: a.data.reservation.ClientId,
    });
    yield put({
      type:"user/UPDATE_USER_TOAST_API",
      payload:{
        num:toastnum,
        status:"SUCCESS",
        message: ""
      }
    })
    yield put({
      type:'order/CHANGE_PERCENT',
              payload:{
                  amount :'',
                  value: ''
            }
      })
  }else if(respon.data.message ==="Maximum Reservation"){
    toastnum++;
    yield put({
      type:"user/UPDATE_USER_TOAST_API",
      payload:{
        num:toastnum,
        status:"RESERVEMAX",
        message: ''
      }
    })
  }else if(respon.data.messgae === 'Invalid USDT'){
    toastnum++;
    yield put({
      type:"user/UPDATE_USER_TOAST_API",
      payload:{
        num:toastnum,
        status:"RESERVENOSYM",
        message: ''
      }
    })
  }
  
}
}

}







function* unMountFutures () {
  var closeUser = yield call(callApi, 'none', 'closeUserStream');
  if(closeUser === 'error' && closeUser.code === undefined){
    closeUser = yield call(callApi, 'none', 'closeUserStream');
  }
  clearUserDataInterval();
}


function arrangePosition(position,test,exchangeInfo) {
  var arrposition = [];
  _.forEach(position, item => {
    let a = test.find(function(o){
      return o.symbol === item.symbol
    })
    let b = exchangeInfo.find(function(o){
      return o.symbol === item.symbol
    })
      if(item.marginType ==="cross"){
        arrposition.unshift({entryPrice: item.entryPrice, markPrice: a.markPrice, leverage: item.leverage, marginType: item.marginType, positionAmt:item.positionAmt, maxNotionalValue:item.maxNotionalValue, symbol: item.symbol, isolatedMargin: item.isolatedMargin, liquidationPrice:item.liquidationPrice,pricePrecision: b.pricePrecision,quantityPrecision: b.quantityPrecision  })
      }else if(item.marginType === 'isolated'){
        arrposition.unshift({entryPrice: item.entryPrice, markPrice: a.markPrice, leverage: item.leverage, marginType: item.marginType, positionAmt:item.positionAmt, maxNotionalValue:item.maxNotionalValue, symbol: item.symbol, isolatedMargin: item.isolatedMargin-item.unRealizedProfit, liquidationPrice:item.liquidationPrice,pricePrecision: b.pricePrecision,quantityPrecision: b.quantityPrecision})
      }
    
  })
  return arrposition;
}


export function * apisaga () {
  yield all([
    takeEvery('api/CHECK_USER_CAN', setUserApi),
    takeEvery('api/CHANGE_MARGIN_MODE', changeMarginMode),
    takeEvery('api/CHANGE_LEVERAGE', changeLeverge),
    takeEvery('api/GET_OPENINTEREST', getOpenInterestInterval),
    takeEvery('api/CANCEL_ORDER', cancelOpenOrder),
    takeEvery('api/CANCEL_REACH_ORDER', cancelReach),
    takeEvery('api/CANCEL_CLOSE_ORDER', cancelClose),
    takeEvery('api/SUMMIT_ORDER', summitOrder),
    takeEvery('api/SET_USER_API_KEY', balanceUserApi),
    takeEvery('api/GET_USER_INCOME', getIncome),
    takeEvery('api/UNMOUNT_FUTURES',unMountFutures),
    takeEvery('api/GET_HOME_KLINE_DATA', getKlineDate),
    takeEvery('api/INITIAL_API_DATA', initialApiData),
    takeEvery('api/REINITIAL_API_DATA',reInitialApiData),
    takeEvery('api/CANCEL_ALL_RESERVE_ORDER',cancelAll),
    takeEvery('hong/GET_MARK',hongData)
  ]);
}

const apiSagas = [apisaga()];
export default apiSagas;
