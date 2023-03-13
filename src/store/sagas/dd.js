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

const max75list = ["ETHUSDT", "XRPUSDT", "EOSUSDT", "LTCUSDT", "TRXUSDT", "ETCUSDT", "LINKUSDT", "XLMUSDT","ADAUSDT","XMRUSDT", "XTZUSDT", "DOTUSDT", "BNBUSDT"]

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



let intervaId = false;
let failCount = 0;
var toastnum =0;


function* initialApiData(action) {
  const info = yield call(callApi, 'none', 'exchangeInfo');
  let symbols = [];
  info.symbols.forEach(item => {
    symbols.push({
      symbol: item.symbol,
      minPrice: parseFloat(item.filters[0].minPrice),
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
      minPrice: parseFloat(a.filters[0].minPrice),
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
        mark: markETH,
        max: maxETH
      }
    })
  }else if(action.payload === 'LINKUSDT'){
    yield put({
      type:"trade/SET_SYMBOL_MARK",
      payload:{
        mark: markLINK,
        max: maxLINK
      }
    })
  }

  const aggtrade = yield call(callApi, action.payload, 'aggtrade');

  const agg = yield call(getAgg1mdata, (action.payload).toLowerCase());
  
  yield put({
    type: 'websocket/GET_AGG_TRADE_1M',
    message: agg.data.message,
  });
  yield put({
    type: 'websocket/FETCH_INITIAL_DATA',
    payload: { aggtrade: aggtrade},
  });
  yield put({
    type: 'order/SET_PRICE',
    payload: aggtrade[0].p
  })
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
  }else if(action.payload === 'LINKUSDT'){
    yield put({
      type:"trade/SET_SYMBOL_MARK",
      payload:{
        mark: markLINK,
        max: maxLINK
      }
    })
  }
  yield put({
    type: 'user/CHANGE_NOW_TRADING_INFO',
    payload:{
      openOrder: nowOpenOrder,
      position: nowPosition
    }
  })
  
  yield put({
    type: 'websocket/GET_AGG_TRADE_1M',
    message: agg.data.message,
  });
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
    console.log(e)
    return "err"
  
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
        return e;
      }
    }
    case 'aggtrade': {
      try {
        returndata = await binance.futuresAggTrades(symbol, { limit: 150 });
        return returndata.reverse();
      } catch (e) {
        return e;
      }
    }
    case 'liquidationOrder': {
      try {
        returndata = await binance.futuresLiquidationOrders(symbol, {
          limit: 30,
        });
        return returndata.reverse();
      } catch (e) {
        return e;
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
        return e;
      }
      break;
    }
    case 'getOpenOrder': {
      try {
        returndata = await binance.futuresOpenOrders();
        console.log(returndata)
        return returndata;
      } catch (e) {
        return e;
      }
    }
    case 'getPositon': {
      try {
        returndata = await binance.futuresPositionRisk();
        //console.log(returndata)
        return returndata;
      } catch (e) {
        return e;
      }
    }
    case 'getAccount': {
      try {
        returndata = await binance.futuresAccount();
       console.log(returndata)
        return returndata;
      } catch (e) {
        return e;
      }
    }
    case 'CROSSED': {
      try {
        returndata = await binance.futuresMarginType(symbol, 'CROSSED');
        return returndata;
      } catch (e) {
        return e;
      }
    }
    case 'ISOLATED': {
      try {
        returndata = await binance.futuresMarginType(symbol, 'ISOLATED');
        return returndata;
      } catch (e) {
        return e;
      }
    }
    case 'openInterest': {
      try {
        returndata = await binance.futuresOpenInterest(symbol);
        return returndata;
      } catch (e) {
        return e;
      }
    }
    case 'futureDaily': {
      try {
        returndata = await binance.futuresDaily(symbol);
        return returndata;
      } catch (e) {
        return e;
      }
    }
    case 'income': {
      try {
        returndata = await binance.futuresIncome({limit:1000, startTime:symbol });
        return returndata;
      } catch (e) {
        return e;
      }
    }

    case 'userTrades':{
      try{
        returndata = await binance.futuresUserTrades("LINKUSDT")
        console.log(returndata)
        return returndata;
      }catch(e){
        return e;
      }
    }
    case 'exchangeInfo':{
      try{
        returndata = await binance.futuresExchangeInfo()
        console.log(returndata)
        return returndata;
      }catch(e){
        return e;
      }
    }
    case 'candleDate':{
      try{
        returndata = await binance.futuresCandless(symbol, '1h', {limit:24})
        
        let a = [];
        _.forEach(returndata, item =>{
          a.push(parseFloat(item[4]))
        })
        //console.log(a)
        return a
      }catch(e){
        return e;
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
    return e;
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
    if (account.msg !== undefined) {
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
  
  if(userInfo.isMem){
    binance.options({
      APIKEY: encryption.Decrypt(userInfo.key[0]),
      APISECRET: encryption.Decrypt(userInfo.key[1]),
      useServerTime: true,
    });
    const account = yield call(callApi, 'none', 'getAccount');
    if(account === 'Invalid API Key' || account === 'Invalid API Secret'){
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
      console.log("timestamp error")
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
    yield put({ type: 'websocket/START_USER-DATA_STREAM', payload: listenKey });
     yield put({
      type: 'user/SET_USER_STATUS',
      payload: "cantrade"
    });
    }else{
      console.log("dont know error")
      console.log(account.msg) 
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
              maintMargin = getIsolatedMaintMargin(item)
              allpositionMargin += item.isolatedMargin
              isolatedUnPnl += unRealizedPNL
              rate = 0;
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
  }else if(position.symbol === 'BCHUSDT'){
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
  max = _.findIndex(maxcont, function(o){
      return o.max === parseFloat(position.maxNotionalValue)
  })
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
  }else{
    let a =_.findIndex(max75list, function(o){
      return o === position.symbol
    })
    if(a !== -1){
      cont = max75Contract
    }else{
      cont = max50Contract
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
  console.log(btcdaily)
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


function * changeMarginMode (action) {
  const a = yield call(callApi,action.payload.symbol, action.payload.mode);
  console.log(a)
  if(a.msg ==="success"){
    //성공
    
  }else{
    //실패
  }
}

function * getOpenInterestInterval (action) {
  const a = yield call(callApi, action.payload, 'openInterest');
  yield put({ type: 'api/SET_OPENINTEREST', payload: a });
}



function * getIncome () {
 
  let income = [];
  let now = 1565758258000; 
  let tranId = 0;
  let nowincome  = yield call(callApi, now, 'income');
 
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

function * changeLeverge (action) {
  const a = yield call(callLeverageApi, action.payload.symbol, action.payload.leverage);
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
}

async function cancelOrder (symbol, orderId) {
  try {
    const returndata = await binance.futuresCancel(symbol, {
      orderId: orderId,
    });
    console.log(returndata);
    return returndata;
  } catch (e) {
    return e;
  }
}

function * cancelOpenOrder (action) {
  console.log(action);
  // const getSymbol = state => state.websocket.symbol;
  // const symbol = yield select(getSymbol);
  const a = yield call(
    cancelOrder,
    action.payload.symbol,
    action.payload.orderId,
  );
  console.log(a);
}


function cancelReachOrders (action) {
  return axios.post('/api/v2/reservations/reach', {
    Symbol: action.payload.symbol,
    ClientId: action.payload.clientId,
  });
}

function cancelCloseOrders (action) {
  return axios.post('/api/v2/reservations/close', {
    Symbol: action.payload.symbol,
    ClientId: action.payload.clientId,
  });
}

function * cancelReach (action) {
  console.log(action);
  const a = yield call(cancelReachOrders, action);
  console.log(a);
  if (a.data.message === 'Successfully canceled') {
    yield put({ type: 'user/DELETE_RESERVE_ORDER', clientId: a.data.clientId });
  }
}

function * cancelClose (action) {
  console.log(action);
  const a = yield call(cancelCloseOrders, action);
  if (a.data.message === 'Successfully canceled') {
    yield put({ type: 'user/DELETE_RESERVE_ORDER', clientId: a.data.clientId });
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
      return 'err';
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
      return 'err';
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
      return 'err'
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
      return 'err'
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
      console.log(e)
      return 'err'
     
    }
    
  }else if(type ==='STOP_MARKET' || type ==='TAKE_PROFIT_MARKET'){
    try{
      const a = await binance.futuresStopMarket(side,type,symbol,amount,trigerprice,triger,{
        reduceOnly: isReduce,
        // newClientOrderId: action.payload.clientId,
      })
      return a
    }catch(e){
      console.log(e)
      return 'err'
     
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
    console.log(e)
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
    console.log(e)
    return 'error';
  }
}


function * summitOrder (action) {
//limit? stop? reserve?
//isMarket? price?
//amount
//side
var result;
var working;
if(action.payload.type ==='Limit'){
  
  if(action.payload.isMarket){
     result = yield call(futureMarketOrder,action.payload.symbol, action.payload.amount, action.payload.side, action.payload.isReduce)
  }else {
     result = yield call(futureLimitOrder,action.payload.symbol,action.payload.price, action.payload.amount, action.payload.side, action.payload.isReduce,action.payload.isPost)
  }
  console.log(result)
  toastnum++;
  if(result.code !==undefined){
    console.log("주문실패")
    yield put({
      type:"user/UPDATE_USER_TOAST_API",
      payload:{
        num:toastnum,
        status:"FAILURE",
        message: result.msg
      }
    })
  }else{
    console.log("주문제출")
    yield put({
      type:"user/UPDATE_USER_TOAST_API",
      payload:{
        num:toastnum,
        status:"SUCCESS",
        message: ""
      }
    })
  }
  // yield put({
  //   type:'order/CHANGE_PERCENT',
  //           payload:{
  //               amount :'',
  //               value: ''
  //         }
  // })
}else if(action.payload.type ==='stop'){
 
  if(action.payload.trigerprice === 'last Price'){
    const getAggtrade = state => state.websocket.aggtrade.slice(0,1)
    const aggtrade = yield select(getAggtrade);
    working = 'CONTRACT_PRICE'
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
  console.log(result)
  toastnum++;
  if(result.code !==undefined){
    console.log("주문실패")
    yield put({
      type:"user/UPDATE_USER_TOAST_API",
      payload:{
        num:toastnum,
        status:"FAILURE",
        message: result.msg
      }
    })
  }else{
    console.log("주문제출")
    yield put({
      type:"user/UPDATE_USER_TOAST_API",
      payload:{
        num:toastnum,
        status:"SUCCESS",
        message: ""
      }
    })
  }
}else if(action.payload.type === "reservation"){
  var price
  var respon
  console.log(action.payload)
  if(action.payload.isMarket){
    price = 'MARKET'
  }else {
    price = action.payload.price
  }
  if(action.payload.isKline){
    if(action.payload.klineDirection ==='up'){
      working = 'mt';
    }else {
      working = 'lt';
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
  console.log(respon)
  if(respon.data.message ==="Successfully reserved"){
    yield put({
      type: 'user/ADD_USER_RESERVE_ORDER',
      order: respon.data.reservation,
      // id: a.data.reservation.ClientId,
    });
  }
  
}

// if(result !== 'err'){
//   yield put({
//     type:'order/CHANGE_PERCENT',
//     payload:{
//         amount :'',
//         value: ''
//     }
// })
// }

}







function* unMountFutures () {
  const closeUser = yield call(callApi, 'none', 'closeUserStream');
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
    takeEvery('api/REINITIAL_API_DATA',reInitialApiData)
  ]);
}

const apiSagas = [apisaga()];
export default apiSagas;
