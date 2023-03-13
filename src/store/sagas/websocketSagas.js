import { eventChannel, buffers } from 'redux-saga';
import {
  put,
  call,
  takeEvery,
  select,
  all,
  flush,
  delay,
} from 'redux-saga/effects';
import _ from 'lodash';

const Binance = require('node-binance-api');
// binance api
const binance = new Binance({
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
var depthSocketBuffer;
var depthSocketBufferB = {};
var depthSocketBufferA = {};
var previousU;
var depthSocketBufferId;
var check = 0;
var newU = false;
var mySocket;
var depthasks = [];
var depthbids = [];
var sumall = 0;
var nowTime = 0;
var buyall = 0;
var sellall = 0;
var agg1s = [];
var buycount = 0;
var sellcount = 0;
var count = 0;
var sellId = 0;
var buyId = 0;
var nowTime1m = 0;
var buyall1m = 0;
var sellall1m = 0;
var agg1m = [];
var agg1mcount = 0;
var buycount1m = [];
var sellcount1m = [];
var sellId1m = 0;
var buyId1m = 0;
var start1m = 0;
var askssum = 0;
var bidssum = 0;
var bigsum = 0;
var nowsymbol = '';
var num = 1;
var highprice = 0;
var lowprice = 0;
var openprice = 0;
var closeprice = 0;
var trade60 = [];
var count1s = [];
var _subs = []
var channelString ='';
var toastnum =0;


//websocket
var agg = [];
var dep = [];
var mark = [];
var accountdata = [];
var futuredaily = [];
var futuresdaily=[];
var activefutures =[];
var futuredata =[];
var openorder = [];
var symbolmark = ''
function createEventChannel2 (buffer, symbol) {
  return eventChannel(emit => {
    function createWS (symbol2) {
      mySocket = new WebSocket('wss://fstream.binance.com/stream');

      mySocket.onopen = function () {
        mySocket.send(
          JSON.stringify({
            method: 'SUBSCRIBE',
            params: [
              `${symbol2}@aggTrade`,
              `${symbol2}@depth@100ms`,
              '!markPrice@arr',
              `${symbol2}@kline_5m`
            ],
            id: num++,
          }),
        );
        mySocket.send(
          JSON.stringify({
            method: 'SUBSCRIBE',
            params: ['!miniTicker@arr'],
            id: num++,
          }),
        );
      };
      channelString = symbol2+"@kline_5m"
      mySocket.onmessage = message => {
        const _data = JSON.parse(message.data);
        if(typeof(_data.result) === 'object'){
          
        }else if(typeof(_data.result) ==='undefined'){
          emit(_data);
        }
      };
      mySocket.onerror = evt => console.log(evt);
      mySocket.onclose = evt => {
        check = 0;
        //createWS(nowsymbol);
      };
    }

    createWS(symbol);

    return () => {
      mySocket.close();
     
    };
  }, buffer || buffers.none());
}

function unSubSymbol (action) {


  mySocket.send(
    JSON.stringify({
      method: 'UNSUBSCRIBE',
      params: [`${action.payload.toLowerCase()}@aggTrade`],
      id: num++,
    }),
  );
  mySocket.send(
    JSON.stringify({
      method: 'UNSUBSCRIBE',
      params: [`${action.payload.toLowerCase()}@depth@100ms`],
      id: num++,
    }),
  );
}

function * clearWebsocket () {
  newU = false;
  depthSocketBufferB = {};
  depthSocketBufferA = {};
  check = 0;
  agg1s.length = 0;
  agg1m.length = 0;
  trade60.length = 0;
  count = 0;
  depthasks.length = 0;
  depthbids.length = 0;
  sumall = 0;
  resetAgg1s();
  resetAgg1m();
  yield put({ type: 'websocket/CLEAR_WEBSOCKET_DATA' });
}

function connectUserStream (action) {

  mySocket.send(
    JSON.stringify({
      method: 'SUBSCRIBE',
      params: [action.payload],
      id: num++,
    }),
  );
}

async function getDepth (symbol) {
  let hsymbol = symbol.toUpperCase();
  const depth = await binance.futuresDepth(hsymbol, { limit: 1000 });

        depthSocketBuffer = depth;
        depthSocketBufferId = depth.lastUpdateId;
        _.each(depthSocketBuffer.bids, function ([k, v]) {
          depthSocketBufferB[k] = v;
        });
        _.each(depthSocketBuffer.asks, function ([k, v]) {
          depthSocketBufferA[k] = v;
        });

  // switch (symbol) {
  //   case 'btcusdt':
  //     {
  //       const depth = await binance.futuresDepth('BTCUSDT', { limit: 1000 });

  //       depthSocketBuffer = depth;
  //       depthSocketBufferId = depth.lastUpdateId;
  //       _.each(depthSocketBuffer.bids, function ([k, v]) {
  //         depthSocketBufferB[k] = v;
  //       });
  //       _.each(depthSocketBuffer.asks, function ([k, v]) {
  //         depthSocketBufferA[k] = v;
  //       });
  //     }
  //     break;
  //   case 'ethusdt':
  //     {
  //       const depth = await binance.futuresDepth('ETHUSDT', { limit: 1000 });

  //       depthSocketBuffer = depth;
  //       depthSocketBufferId = depth.lastUpdateId;
  //       _.each(depthSocketBuffer.bids, function ([k, v]) {
  //         depthSocketBufferB[k] = v;
  //       });
  //       _.each(depthSocketBuffer.asks, function ([k, v]) {
  //         depthSocketBufferA[k] = v;
  //       });
  //     }
  //     break;
  //     case 'linkusdt':
  //     {
  //       const depth = await binance.futuresDepth('LINKUSDT', { limit: 1000 });

  //       depthSocketBuffer = depth;
  //       depthSocketBufferId = depth.lastUpdateId;
  //       _.each(depthSocketBuffer.bids, function ([k, v]) {
  //         depthSocketBufferB[k] = v;
  //       });
  //       _.each(depthSocketBuffer.asks, function ([k, v]) {
  //         depthSocketBufferA[k] = v;
  //       });
  //     }
  //     break;

  //   default:
  //     break;
  // }
}

function * subNewSymbolWebsocket () {
  const getSymbol = state => state.trade.symbol;
  const symbol = (yield select(getSymbol)).toLowerCase(); // symbol 가져오기
  nowsymbol = symbol;
  mySocket.send(
    JSON.stringify({
      method: 'SUBSCRIBE',
      params: [`${symbol}@aggTrade`],
      id: num++,
    }),
  );
  mySocket.send(
    JSON.stringify({
      method: 'SUBSCRIBE',
      params: [`${symbol}@depth@100ms`],
      id: num++,
    }),
  );
}

//chart function

function* subscribeBars(action){
  var cs= updateInterval(action.payload.resolution, action.payload.symbolInfo.exchange);
  var syminfo = action.payload.symbolInfo
  var updateCb = action.payload.onRealtimeCallback
  var uid = action.payload.subscribeUID
  var resol = action.payload.resolution
  const getInterval = state => state.chart.interval;
  const interval = yield select(getInterval)
  if(interval !== resol){
    yield put({
      type:'chart/CHANGE_KLINE_INTERVAL',
      payload: resol
    })
  }
  const sub = _subs.find(e => e.channelString === cs)
  if(mySocket !== undefined){
    if(sub){

    }else if(channelString !== cs) {
      channelString = cs
        mySocket.send(
          JSON.stringify({
            method: 'SUBSCRIBE',
            params: [channelString],
            id: num++
          })
        )
    }
    const getHistory = state => state.chart.history
    const history = yield select(getHistory)
    var newSub = {
      channelString,
      uid,
      resol,
      syminfo,
      lastBar: history[syminfo.name].lastBar,
      listener: updateCb,
    }
    _subs.shift();
    _subs.push(newSub);
  }
}

// function* unsubscribeBars (uid){
//   var subIndex = _subs.findIndex(e => e.uid === uid);
//   if(subIndex === -1){
//     return
//   }

//   var sub = _subs[subIndex]
//   mySocket.send(
//     JSON.stringify({
//       method: 'UNSUBSCRIBE',
//       params: [
//         sub.channelString
//       ],
//       id: num++
//     })
//   )
//   _subs.splice(subIndex, 1)
// }

function updateBar(data, sub) {
  var lastBar = sub.lastBar
  let resolution = sub.resol
  if (resolution.includes('D')) {
    // 1 day in minutes === 1440
    resolution = 1440
  } else if (resolution.includes('W')) {
    // 1 week in minutes === 10080
    resolution = 10080
  } else if (resolution.includes('m')) {
    resolution = parseInt(resolution.slice(0, 1), 10)
  }

  var coeff = resolution * 60

  var lastBarSec = lastBar.time + coeff * 1000// / 1000
  var _lastBar


  if (data.ts >= lastBarSec) {
    
    _lastBar = {
      time: lastBarSec, // * 1000
      open: lastBar.close,
      high: lastBar.close,
      low: lastBar.close,
      close: data.price,
      volume: Math.ceil(data.volume)
    }

  } else {
    if (data.price < lastBar.low) {
      lastBar.low = data.price
    } else if (data.price > lastBar.high) {
      lastBar.high = data.price
    }

    lastBar.volume = data.volume
    lastBar.close = data.price

    _lastBar = lastBar
  }
  return _lastBar
}

function updateInterval(resolution, symbol) {
  var i = ''

  if (30 < parseInt(resolution, 10) && parseInt(resolution, 10) <= 240) {
    i = parseInt(resolution, 10) / 60 + 'h'
  } else if (resolution==="1D") {
    i = 1 + 'd'
  } else if (parseInt(resolution, 10) <= 30) {
    i = resolution + 'm'
  }

  const channelString = symbol + '@kline_' + i

  return channelString
}


//chart  history function

function getPriceChnagePercent(last, open){
  return parseFloat(((last-open)/open)*100).toFixed(2)
}


async function getFutureKline (q2,onErrorCallback) {
  try {
    const returndata = await binance.futuresCandles(q2.symbol,q2.interval,q2.startTime,q2.endTime,q2.limit)
    return returndata;
  } catch (e) {
    onErrorCallback(e)
  }
}

function* historyGetBars (action) {
 //240 < parseInt(reslo, 10)
   var i = ''
   var syminfo = action.payload.symbolInfo
   var reslo = action.payload.resolution
   var from = action.payload.from
   var to = action.payload.to
   if (30 < parseInt(reslo, 10) && parseInt(reslo, 10) <= 240) {
    i = parseInt(reslo, 10)/60 + 'h'
  } else if (reslo ==='1D') {
    i = 1 + 'd'
  } else if (parseInt(reslo, 10) <= 30) {
    i = reslo + 'm'
  }
  const qs2 = {
    symbol: syminfo.exchange,
    interval: i,
    startTime: from * 1000,
    endTime: to * 1000,
    limit: '1500'
  }

  const candleData = yield call(getFutureKline,qs2,action.payload.onErrorCallback)
  if(candleData.length){
    var arr = {candleData}.candleData
    var bars =[]

    for(var j=0; j<arr.length; j++){
      bars.push({
        time: parseInt(arr[j][0], 10),
            open: parseFloat(arr[j][1], 10),
            high: parseFloat(arr[j][2], 10),
            low: parseFloat(arr[j][3], 10),
            close: parseFloat(arr[j][4], 10),
            volume: parseFloat(arr[j][5], 10)
      })
    }

  if(action.payload.firstDataRequest){
    var lastBar = bars[bars.length-1]
    yield put({
      type: 'chart/HISTORY_SET_LAST_BAR',
      payload:{
        name: syminfo.name,
        lastBar: lastBar
      }
    })
    }
  }
  if(bars.length){
    action.payload.onHistoryCallback(bars, {noData: false})
  }else {
    action.payload.onHistoryCallback(bars, {noData: true})
  }
 
}

function * initializeWebSocketsChannel () {
  newU = false;
  const getSymbol = state => state.trade.symbol;
  const getfuturedaily = state => state.websocket.futuredaily;
  const getfuturesdaily = state => state.websocket.futuresdaily;
  const getUnit = state => state.trade.orderbook.unit
  const getDigit = state => state.trade.orderbook.pricedigit//getIn(['orderbook','pricedigit'])
  const getRowCount = state => state.trade.orderbook.rowCount;
  const getListenKey = state => state.websocket.listenKey; //login 
  const getUserInfo = state => state.user.userTraInfo; //login
  const getUserMargin = state => state.user.userMargin; //login
  const getPriceDigit = state => state.trade.exchangeInfo.pricePrecision//getIn(['orderbook','pricedigit'])
  const getRate = state => state.websocket.rate;
  const getFundingTime = state => state.websocket.fundingTime
  const getuserOptional = state => state.user.useOptional.optional
  const symbol = (yield select(getSymbol)).toLowerCase(); // symbol 가져오기
  const channel = yield call(
    createEventChannel2,
    buffers.expanding(50),
    symbol,
  );
  yield put({
    type: 'chart/SET_CHART_READY',
    payload: true
  });

  while (true) {
    try {
      const message = yield flush(channel);
      const symbol2 = (yield select(getSymbol)).toLowerCase();
      const unit = yield select(getUnit); // unit 가져오기
      //console.log(unit)
      const digit = yield select(getDigit); // 유효숫자 가져오기
      const rowCount = yield select(getRowCount);
      const listenKey = yield select(getListenKey);
      const userInfo = yield select(getUserInfo);
      const userMargin = yield select(getUserMargin);
      const priceDigit = yield select(getPriceDigit)
      const daily = yield select(getfuturedaily)
      const dailys = yield select(getfuturesdaily)
      const actives = yield select(getuserOptional)
      const rate = yield select(getRate)
      const fundingTime = yield select(getFundingTime)
      agg = [];
      dep = [];
      mark = [];
      accountdata = [];
      futuredaily = [];
      futuresdaily = [];
      futuredata =[]
      openorder = [];
      activefutures=[];
      symbolmark = ''
      message.forEach(item => {
        switch (item.stream) {
          case `${symbol2}@aggTrade`: {
            agg.push(item.data);
            break;
          }
          case '!markPrice@arr': {
            mark = item.data;
            break;
          }
          case `${symbol2}@depth@100ms`:{
            dep.push(item.data);
            break;
          }
          case '!miniTicker@arr': {
            item.data.forEach(ticker => {
              var status= false;
              var a = actives.indexOf(ticker.s+",")
              if(a !==-1){
                status = true
              }
              futuresdaily.push({symbol: ticker.s, active:status, l:ticker.l, h:ticker.h, v:ticker.v,lastPrice: ticker.c, openPrice: ticker.o, priceChange: (ticker.c-ticker.o), priceChangePercent: getPriceChnagePercent(ticker.c, ticker.o)});
            });
            break;
          }
          case `${listenKey}`: {

            if (item.data.e === 'ORDER_TRADE_UPDATE') {
              if (item.data.o.o !== 'TRAILING_STOP_MARKET') {
                openorder.push({
                  avgPrice: item.data.o.ap,
                  clientOrderId: item.data.o.c,
                  closePosition: item.data.o.cp,
                  cumQuote: item.data.o.l,
                  executedQty: item.data.o.z,
                  orderId: item.data.o.i,
                  origQty: item.data.o.q,
                  origType: item.data.o.ot,
                  positionSide: item.data.o.ps,
                  price: item.data.o.p,
                  reduceOnly: item.data.o.R,
                  side: item.data.o.S,
                  status: item.data.o.X,
                  stopPrice: item.data.o.sp,
                  symbol: item.data.o.s,
                  time: item.data.o.T,
                  timeInForce: item.data.o.f,
                  type: item.data.o.o,
                  workingType: item.data.o.wt,
                });
              } else {
                openorder.push({
                  activatePrice: item.data.o.AP,
                  avgPrice: item.data.o.ap,
                  clientOrderId: item.data.o.c,
                  closePosition: item.data.o.cp,
                  cumQuote: item.data.o.l,
                  executedQty: item.data.o.z,
                  orderId: item.data.o.i,
                  origQty: item.data.o.q,
                  origType: item.data.o.ot,
                  positionSide: item.data.o.ps,
                  price: item.data.o.p,
                  priceRate: item.data.o.cr,
                  reduceOnly: item.data.o.R,
                  side: item.data.o.S,
                  status: item.data.o.X,
                  stopPrice: item.data.o.sp,
                  symbol: item.data.o.s,
                  time: item.data.o.T,
                  timeInForce: item.data.o.f,
                  type: item.data.o.o,
                  workingType: item.data.o.wt,
                });
              }
            } else if (item.data.e === 'ACCOUNT_UPDATE') {
              accountdata.push(item.data)
            }
            
            break;
          }
          case `${channelString}`:{
            var data = {
              symbol: item.data.k.s,
              trade_id: item.data.k.f,
              ts: parseInt(item.data.E,10),
              volume: parseFloat(item.data.k.v),
              price: parseFloat(item.data.k.c)
            }
            var sub = _subs.find(e => e.channelString === item.stream)
           
            if(sub){
              if(data.ts< sub.lastBar.time/1000){
                return
              }
              var _lastBar = updateBar(data,sub)
              sub.listener(_lastBar)
              sub.lastBar = _lastBar
            }
            break;
          }
          default:{
            break;
          }
           
        }
      });

    
      if (agg.length) {
        agg.forEach(item => {
          if (count === 0) {
            nowTime = Math.floor(item.T / 1000);
            nowTime1m = Math.floor(item.T / 60000);
            highprice = item.p;
            lowprice = item.p;
            openprice = item.p;
            countAgg(item);
            countAgg1m(item);
            count++;
          } else {
            if (nowTime === Math.floor(item.T / 1000)) {
              countAgg(item);
              if (highprice < item.p) highprice = item.p;
              if (lowprice > item.p) lowprice = item.p;
              closeprice = item.p;
            } else {
              if (sellcount > 0)
                agg1s.unshift({
                  T: nowTime * 1000,
                  a: sellId,
                  p: parseFloat(sellall / sellcount).toFixed(priceDigit),
                  q: sellcount,
                  m: true,
                });
              if (buycount > 0)
                agg1s.unshift({
                  T: nowTime * 1000,
                  a: buyId,
                  p: parseFloat(buyall / buycount).toFixed(priceDigit),
                  q: buycount,
                  m: false,
                });
              if (closeprice !== 0) {
                trade60.unshift({
                  T: nowTime * 1000,
                  o: openprice,
                  c: closeprice,
                  h: highprice,
                  l: lowprice,
                });
              }
              nowTime = Math.floor(item.T / 1000);
              highprice = item.p;
              lowprice = item.p;
              openprice = item.p;
              count1s.unshift({ T: nowTime * 1000, h: highprice, l: lowprice });
              resetAgg1s();
              countAgg(item);
            }

            if (nowTime1m === Math.floor(item.T / 60000)) {
              countAgg1m(item);
            } else {
              if (sellcount1m > 0)
                agg1m.unshift({
                  T: nowTime1m * 60000,
                  a: sellId1m,
                  p: parseFloat(sellall1m / sellcount1m).toFixed(priceDigit),
                  q: sellcount1m,
                  m: true,
                });
              if (buycount1m > 0)
                agg1m.unshift({
                  T: nowTime1m * 60000,
                  a: buyId1m,
                  p: parseFloat(buyall1m / buycount1m).toFixed(priceDigit),
                  q: buycount1m,
                  m: false,
                });

              nowTime1m = Math.floor(item.T / 60000);
              resetAgg1m();
              countAgg1m(item);
              agg1mcount++;
            }
          }
        });

        if (agg1s.length > 120) agg1s = agg1s.slice(0, 120);

        if (agg1mcount > 0) {
          agg1m = agg1m.slice(0,2)

          if (start1m > 0) {
            yield put({
              type: 'websocket/UPDATE_AGG_TRADE_1M',
              message: agg1m,
            });
          } else {
            start1m++;
          }

          agg1mcount = 0;
        }

        if (agg.length > 150) {
          agg = agg.reverse().slice(0, 150);
        }
        yield put({ type: 'websocket/GET_AGG_TRADE', message: agg.reverse() });
        
       

        if (count1s.length) {
          yield put({
            type: 'websocket/GET_AGG_TRADE_1S',
            message1s: agg1s,
            message60: trade60,
          });
          count1s.pop();
        }
        agg.length=0;
      }

      if (dep.length) {
       
        if (check === 0) {
          yield call(getDepth,symbol2);
          check++;
        }else{ 
          _.each(dep, item => {
            if(check!==0){
              depthUpdate(item, unit, digit,rowCount);
            }
          });
          yield put({
            type: 'orderbook/SET_ORDERBOOK',
            asks: depthasks,
            bids: depthbids,
            sum: bigsum,
          });
        }
        dep.length=0;
      }
      if (mark.length) { 
        var symblmarkInfo = {};
        mark.forEach(item => {
          if(item.s === symbol2.toUpperCase()){
            symbolmark = item.p;
            symblmarkInfo = item
          }
        })

        if(parseFloat(symblmarkInfo.r).toFixed(6) !== rate){
          yield put ({
            type:"websocket/CHANGE_RATE",
            payload: parseFloat(symblmarkInfo.r).toFixed(6)
          })
        }
        if(symblmarkInfo.T !== fundingTime){
          yield put ({
            type:"websocket/CHANGE_FUNDING_TIME",
            payload: symblmarkInfo.T
          })
        }

        yield put({ type: 'websocket/GET_MARKPRICE', mark, symbolmark,symblmarkInfo });

      

        if(userInfo.position.length && userMargin.activeOrder.length){
            var marginInfo = calcOpenOrders(userInfo.position,userMargin.activeOrder,mark, userInfo.margin[0].walletBalance,symbol2.toUpperCase());
            yield put({
            type: 'user/UPDATE_USER_ACCOUNT_INFO',
            payload:{
              symbolPosition: marginInfo.nowSymbolPositon,
              positions: marginInfo.positions,
              crossPositionValue: marginInfo.crossPositionValue,
              crossWallet: marginInfo.crossWallet,
              crossMaintMargin: marginInfo.crossMaintMargin,
              positionInitialMargin: marginInfo.positionInitialMargin,
              openOrderInitialMargin: marginInfo.openOrderInitialMargin,
              crossedUnPnl: marginInfo.crossedUnPnl,
              unRealizedPnl: marginInfo.unrealizedPnl, 
              maintAmount: marginInfo.maintAmount,
              availableBalance: Math.max(0,userInfo.margin[0].walletBalance-marginInfo.positionInitialMargin-marginInfo.openOrderInitialMargin+marginInfo.crossedUnPnl)
            }
          })
        }

        
      }
      
      if(futuresdaily.length){
        // var futuredata =[];
        var b = futuresdaily.find(function(o){
          return o.symbol === symbol2.toUpperCase()
        }) 

        dailys.forEach(item => {
          var a = futuresdaily.find(function(o){
            return item.symbol === o.symbol
          })
          if( a== undefined){
            futuredata.push(item)
          }else{
            futuredata.push(a)
          }
        })  
       
        futuredata.forEach(item =>{
          var a = actives.indexOf(item.symbol+",")
          if(a !== -1){
            activefutures.unshift(item)
          }
        })

       
        yield put({
          type: 'websocket/GET_FUTURES_DAILY',
          dailys: futuredata,
          actives: activefutures
        });
        if(b !== undefined){
          yield put({
            type:'websocket/GET_SYMBOL_FUTURE_DAILY',
            payload: b
          })
        }
      }

      if(openorder.length){
        
        var coponorder = userInfo.openOrder;
        
        openorder.forEach(item => {
          num = _.findIndex(coponorder, function (o) {
            return o.orderId === item.orderId;
          });
          if (num === -1) {
            coponorder.unshift(item);
          }else {
            coponorder = (coponorder).map(l =>
              l.orderId === item.orderId ? item : l
            )
          }
        });
        
        var k = undefined;
        _.forEach(coponorder, item =>{
          
          if(item.status ==='PARTIALLY_FILLED' ||item.status ==='FILLED' ||item.status ==='CANCELED' ){
            k = item
          }
        })
        
        if(k !== undefined){
          
          toastnum++;
          yield put({
            type:"user/UPDATE_USER_TOAST_WEBSOCKET",
            payload:{
              num:toastnum,
              status:k.status,
              side:k.side,
              type: k.type
            }
          })
        }
        //k.status -> PARTIALLY_FILLED FILLED CANCELED
        //k.side => BUY SELL
        //k.type => MARKET LIMIT 
        
        coponorder = _.filter(coponorder, item => item.status ==="NEW" || item.status === "PARTIALLY_FILLED")
        var active = _.filter(coponorder, item => item.type === 'LIMIT');
        var stop = _.filter(
          coponorder,
          item => (item.type !== 'LIMIT') & (item.type !== 'MARKET'),
        );
        var nowOpenOrder = _.filter(coponorder, item => item.symbol === symbol2.toUpperCase());
        var ordermargin = yield call(calcOpenOrderMargin, active, userInfo.position);
        
        yield put({
          type: 'user/GET_OPENORDER_MARGIN',
          payload: { activemargin: ordermargin },
        });
        yield put({
          type: 'user/ORDER_UPDATE',
          orderlist: coponorder,
          active: active,
          stop: stop,
          nowOpenOrder: nowOpenOrder,
          al: active.length,
          sl: stop.length
        });
      } 
      if(accountdata.length){
        var chp =[];
        var c;
      
        _.forEach(accountdata, item => {
          if(item.a.P.length){
            _.forEach(item.a.P, l =>{
              let p = _.find(userInfo.position, function(o){
                return o.symbol === l.s
              })
              if(p !== undefined && l.ma==="USDT"){
                if(chp.length){
                  chp = (chp).map(item =>
                    item.symbol === l.s ? {...item, entryPrice: l.ep, isolatedMargin:parseFloat(l.iw),positionAmt: l.pa, marginType:l.mt} : item
                  )
                }else{
                  chp = (userInfo.position).map(item =>
                    item.symbol === l.s ? {...item, entryPrice: l.ep, isolatedMargin:parseFloat(l.iw),positionAmt: l.pa,marginType:l.mt} : item
                  )
                }
              }
            })
          }
          let b = _.find(item.a.B, function(o){
            return o.a ==='USDT'
          })
          if(b !==undefined){
            c = b;
          }
        })
        if(chp.length){
         
          var h = _.filter(chp, item => parseFloat(item.positionAmt)!==0)
          var nowp = _.filter(chp,item => item.symbol === symbol2.toUpperCase())
          yield put({
            type:'user/UPDATE_USER_POSITIONS',
            payload: {
              position: chp,
              hl: h.length,
              nowPosition: nowp
            }
          })
        }

        if(c !== undefined){
          yield put({
            type: 'user/UPDATE_USER_TRADING_MARGIN',
            payload: {
              margin: [{asset: c.a, walletBalance: c.wb}],//account.assets, 
            },
          });
        }
          
      }

      yield delay(100);
    } catch (e) {

    }
  }
}





function calcOpenOrderMargin (active, position) {
  var activeMargin = [];
  var activeMargin2 = [];
  var levValue = 0;
  _.forEach(position, (item, index) => {
    activeMargin[index] = { symbol: item.symbol, buy: 0, sell: 0 };
    activeMargin2[index] = { symbol: item.symbol, margin: 0 };
  });

  _.forEach(active, item => {
    var inde = _.findIndex(activeMargin, function (o) {
      return o.symbol === item.symbol;
    });
    levValue = Math.ceil((1 / position[inde].leverage) * 10000) / 10000;
    if (item.side === 'BUY') {
      activeMargin[inde].buy +=
        levValue * item.price * (item.origQty - item.cumQuote);
      activeMargin2[inde] +=
        levValue * item.price * (item.origQty - item.cumQuote);
    } else if (item.side === 'SELL') {
      activeMargin[inde].sell +=
        levValue * item.price * (item.origQty - item.cumQuote);
      activeMargin2[inde] -=
        levValue * item.price * (item.origQty - item.cumQuote);
    }
  });

  return activeMargin;
}

function calcOpenOrders(position, orderMargin, markprice, walletBalance,symbol) {
  var isolatedMargin =0;
  var crossedUnPnl =0;
  var isolatedUnPnl = 0;
  var allpositionMargin = 0;
  var allactiveMargin =0;
  var maintInfo = {};
  var maintAmount = 0;
  var isolatedWalletMargin=0;
  var maintMargin =0;
  var crossMaintMargin = 0;
  var openOrderMargin=0;
  var rate =0;
  var positionInfo =[];
  var crossPositionValue = 0;
  var nowSymbolPositon ={}
  _.forEach(position, (item) => {
    var levValue = Math.ceil((1/item.leverage)*10000)/10000;
    var a = orderMargin.find(function(o){
        return o.symbol === item.symbol
    })
    var b = markprice.find(function(o){
      return o.s === item.symbol
    })
    var positionMargin = levValue*Math.abs(item.positionAmt)*b.p
    var unRealizedPNL = parseFloat((b.p - item.entryPrice)*item.positionAmt)
    isolatedMargin += parseFloat(item.isolatedMargin); //달라지는거 없을듯?

      if(Math.abs(item.positionAmt)>0){
        if(item.marginType=== "cross"){
          maintInfo = getMaintMargin(item);
          allpositionMargin += positionMargin
          crossedUnPnl += unRealizedPNL
          maintMargin= maintInfo.maintmargin
          maintAmount += maintInfo.maintamount
          crossMaintMargin += maintInfo.maintmargin
          rate = maintInfo.rate
          crossPositionValue += Math.abs(item.positionAmt)*b.p;
          //isolatedAmount =0;
        }else if(item.marginType ==='isolated'){
          maintInfo = getMaintMargin(item)
          allpositionMargin += item.isolatedMargin
          isolatedWalletMargin+= item.isolatedMargin
          isolatedUnPnl += unRealizedPNL
          maintMargin= maintInfo.maintmargin
          rate = maintInfo.rate
          maintAmount += maintInfo.maintamount
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

      
      positionInfo.unshift({symbol: item.symbol, entryPrice: item.entryPrice, positionAmt: item.positionAmt, markPrice: b.p,maxNotionalValue:item.maxNotionalValue,leverage: item.leverage,rate: rate, marginType: item.marginType, isolatedMargin: item.isolatedMargin, liquidationPrice: item.liquidationPrice, positionMargin:positionMargin, maintMargin: maintMargin, openOrderMargin: openOrderMargin, unRealizedPNL : unRealizedPNL,pricePrecision: item.pricePrecision,quantityPrecision: item.quantityPrecision })
      
  })

  _.forEach(positionInfo, item => {
    if(item.marginType === 'cross' && Math.abs(item.positionAmt)>0){

      var a = parseFloat((1*walletBalance - isolatedMargin - (crossMaintMargin - item.maintMargin)+(crossedUnPnl - item.unRealizedPNL) + (maintAmount - item.positionAmt*item.entryPrice))/(item.rate*Math.abs(item.positionAmt)/100 -1*item.positionAmt)).toFixed(item.pricePrecision)

      if(a >0){
        item.liquidationPrice = a
      }else{
        item.liquidationPrice = 0
      }
       // item.liquidationPrice = parseFloat((1*walletBalance - isolatedMargin - (crossMaintMargin - item.maintMargin)+(crossedUnPnl - item.unRealizedPNL) + (maintAmount - item.positionAmt*item.entryPrice))/(item.rate*Math.abs(item.positionAmt)/100 -1*item.positionAmt)).toFixed(item.pricePrecision)
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
//{positionMargin:positionMargin, activeOrderMargin : openOrders,isolatedMargin:isolatedMargin,totalPositionMargin: allpositionMargin, totlaOrderMargin: allactiveMargin, crossedUnrealizedPnl:crossedUnPnl, isolatedUnrealizedPnl: isolatedUnPnl}
  return {positions: positionInfo, isolatedMargin: isolatedMargin,crossPositionValue: crossPositionValue,crossWallet: 1*walletBalance-isolatedMargin+crossedUnPnl, crossMaintMargin: crossMaintMargin, positionInitialMargin: allpositionMargin, openOrderInitialMargin: allactiveMargin, crossedUnPnl: crossedUnPnl, unrealizedPnl: crossedUnPnl+ isolatedUnPnl,maintAmount: maintAmount ,nowSymbolPositon:nowSymbolPositon}
}

function getMaintMargin (position){
  if(position.symbol ==='BTCUSDT'){
    return calcMaintMargin(1, position);
  }else if(position.symbol === 'ETHUSDT'){
    return calcMaintMargin(2,position)
  }else if(position.symbol === 'GRTUSDT' || position.symbol === '1INCHUSDT'){
    return calcMaintMargin(3, position)
  }else{
    var a = _.findIndex(max75list, function(o){
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

    var max = 0;
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
    // if(num !==0){
    //   maintamount= maxcont[num].marginAmount+ maxcont[num-1].marginAmount
    // }else{
    //   maintamount= 0
    // }

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
    cont = max100Contract
  }else if(position.symbol === 'GRTUSDT' || position.symbol === '1INCHUSDT'){
    cont = max20Contract
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


function depthUpdate (obj, unit, digit,rowCount) {
  
  let id = depthSocketBufferId;
  let bufferB = depthSocketBufferB;
  let bufferA = depthSocketBufferA;
  let { U } = obj;
  let { u } = obj;
  let { b } = obj;
  let { a } = obj;
  let { pu } = obj;
  const updateDepthCache = function () {
    _.each(b, function ([k, v]) {
      if (parseFloat(v) === 0) delete bufferB[k];
      else bufferB[k] = v;
    });
    _.forEach(a, function ([k, v]) {
      if (parseFloat(v) === 0) delete bufferA[k];
      else bufferA[k] = v;
    });
    previousU= u;
  };

  
  if(id){
    if(u<id){
      // console.log('drop')
    }else if(!newU && U<= id && u >= id){
      console.log('first change')
      updateDepthCache();
      newU = u;
    }else if(newU && previousU !== pu){
      console.log('restart')
      check=0;
      previousU = false;
      newU=false;
      depthSocketBufferB = {};
      depthSocketBufferA = {};
      bufferB={}
      bufferA={}
      // console.log('restart')
      return;
    }else{
      newU += 1;
      updateDepthCache();
    }
  }else updateDepthCache();

  // if (u) {
  //   if (u <= id) {
  //   } else if (!newU && U <= id + 1 && u >= id + 1) {
  //     updateDepthCache();
  //     newU = u;
  //   }else {
  //     newU += 1;
  //     updateDepthCache();
  //   }
  // } else updateDepthCache();

  bufferB = sortKeys(bufferB, false);
  bufferA = sortKeyss(bufferA, false);
  sumall = 0;
  let index = -1;
  depthasks = [];
  depthbids = [];
  askssum = 0;
  bidssum = 0;
  let ch;
  _.each(bufferA, function (key, value) {
    ch = (Math.ceil(value / unit) * unit).toFixed(digit);
    if (index === -1) {
      index++;
      depthasks.push({
        amount: parseFloat(key),
        price: ch,
        sum: parseFloat(key),
      });
    } else if (depthasks[index].price === ch) {
      depthasks[index].amount += parseFloat(key);
      depthasks[index].sum += parseFloat(key);
    } else {
      index++;
      depthasks.push({
        amount: parseFloat(key),
        price: ch,
        sum: sumall + parseFloat(key),
      });
      if(index>=399){
        sumall += parseFloat(key);
        return false;
      }
    }
    sumall += parseFloat(key);
  });
  index = -1;
  sumall = 0;
  _.each(bufferB, function (key, value) {
    ch = (Math.floor(value / unit) * unit).toFixed(digit);
    if (index === -1) {
      index++;
      depthbids.push({
        amount: parseFloat(key),
        price: ch,
        sum: parseFloat(key),
      });
    } else if (depthbids[index].price === ch) {
      depthbids[index].amount += parseFloat(key);
      depthbids[index].sum += parseFloat(key);
    } else {
      index++;
      depthbids.push({
        amount: parseFloat(key),
        price: ch,
        sum: sumall + parseFloat(key),
      });
      if(index>=399){
        sumall += parseFloat(key);
        return false;
      }
    }
    sumall += parseFloat(key);
  });
  //console.log(depthasks)

  if(rowCount>1){
    if (depthasks.length > rowCount) askssum = depthasks[rowCount-1].sum;
    else askssum = depthasks[depthasks.length - 1].sum;
  
    if (depthbids.length > rowCount) bidssum = depthbids[rowCount-1].sum;
    else bidssum = depthbids[depthbids.length - 1].sum;
  
    if (bidssum > askssum) bigsum = bidssum;
    else bigsum = askssum;
  }
}

function sortKeys (obj, desc) {
  var keys = Object.keys(obj);
  keys.sort((a, b) => {
    var d = +b - +a;
    return desc ? -d : d;
  });
  var res = {};
  if(keys.length>1000){
    keys.length=1000;
  }
  keys.forEach(i => (res[i] = obj[i]));
  return res;
}

function sortKeyss (obj, desc) {
  var keys = Object.keys(obj);
  keys.sort((a, b) => {
    var d = +a - +b;
    return desc ? -d : d;
  });
  var res = {};
  if(keys.length>1000){
    keys.length=1000;
  }
  keys.forEach(i => (res[i] = obj[i]));
  return res;
}

function countAgg (item) {
  if (item.m === true) {
    sellall += item.p * item.q;
    sellcount += parseFloat(item.q);
    sellId = item.a;
  } else {
    buyall += item.p * item.q;
    buycount += parseFloat(item.q);
    buyId = item.a;
  }
}

function countAgg1m (item) {
  if (item.m === true) {
    sellall1m += item.p * item.q;
    sellcount1m += parseFloat(item.q);
    sellId1m = item.a;
  } else {
    buyall1m += item.p * item.q;
    buycount1m += parseFloat(item.q);
    buyId1m = item.a;
  }
}

function resetAgg1s () {
  sellall = 0;
  sellcount = 0;
  buyall = 0;
  buycount = 0;
  if (trade60.length > 60) {
    trade60.pop();
  }
}

function resetAgg1m () {
  sellall1m = 0;
  sellcount1m = 0;
  buyall1m = 0;
  buycount1m = 0;
}


function* unMountWebsocket() {
  mySocket.close();
  newU = false;
  depthSocketBufferB = {};
  depthSocketBufferA = {};
  check = 0;
  agg1s.length = 0;
  agg1m.length = 0;
  trade60.length = 0;
  count = 0;
  depthasks.length = 0;
  depthbids.length = 0;
  sumall = 0;
  resetAgg1s();
  resetAgg1m();
  yield put({ type: 'websocket/CLEAR_WEBSOCKET_DATA' });
}

export function * websocketsa () {
  yield all([
    takeEvery(
      'websocket/INITIALIZE_WEB_SOCKETS_CHANNEL',
      initializeWebSocketsChannel,
    ),
    takeEvery('websocket/START_USER-DATA_STREAM', connectUserStream),
    takeEvery('websocket/UNSUBSCRIBE_WEBSOCKET', unSubSymbol),
    takeEvery(
      'websocket/SUBSCRIBE_NEW_SYMBOL_WEBSOCKET',
      subNewSymbolWebsocket,
    ),
    takeEvery('websocket/CLEAR_ALL_DATA', clearWebsocket),
    takeEvery('websocket/UNMOUNT_WEBSCOKET_FUTURES', unMountWebsocket),
    takeEvery('chart/SUBSCRIBE_BARS', subscribeBars),
    takeEvery('chart/HISTORY_GET_BARS', historyGetBars)
  ]);

}

const websocketSagas = [websocketsa()];
export default websocketSagas;
