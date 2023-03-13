import { takeEvery, all, select, put,  } from 'redux-saga/effects';
import _ from 'lodash';

function * summitOrderbookOrder (action) {
  const getValue = state => state.trade.orderbook.sliderValue;
  const getAmount = state => state.trade.orderbook.value;
  const getIsReduce = state => state.trade.orderbook.isReduce;
  const isReduce = yield select(getIsReduce)
  const value = yield select(getValue)
  const amountsym = yield select(getAmount)
  if(value !==0 && value !==''){
    const getSymbolPosition = state => state.user.userBalance.symbolPosition
    const getAvailableBalance = state => state.user.userBalance.availableBalance;
    const getUserActiveOrder = state => state.user.userMargin.activeOrder
    const getAsks = state => state.orderbook.asks.slice(0,1)
   
    const symbolPosition = yield select(getSymbolPosition);
    const availableBalance = yield select(getAvailableBalance);
    const userActiveOrder = yield select(getUserActiveOrder)
    const asks = yield select(getAsks)
    
    let buyamount =0;
    let sellamount =0;
    if(isReduce){
      if(parseFloat(symbolPosition.positionAmt)>0){
        sellamount = parseFloat(symbolPosition.positionAmt*value/100).toFixed(symbolPosition.quantityPrecision)
      }else{
        buyamount = parseFloat(Math.abs(symbolPosition.positionAmt)*value/100).toFixed(symbolPosition.quantityPrecision)
      }
    }else{
      const levValue = Math.ceil((1 / symbolPosition.leverage) * 10000) / 10000;
      var maxMargin;
        if(symbolPosition.maxNotionalValue ==="INF"){
          maxMargin = Math.pow(10,10);
        }else{
          maxMargin = symbolPosition.maxNotionalValue*levValue;
        }
      var activeorder = _.find(userActiveOrder,function(o){
                return o.symbol === action.payload.symbol
            })
      var positionMargin = symbolPosition.positionMargin
      let availbuy =0;
      let availsell =0;
      let availbuyValue =0;
      let availsellValue = 0;
      let maxuse=0;
      
      
      if(parseFloat(symbolPosition.positionAmt) ===0){
        maxuse = Math.min(Math.max(activeorder.buy,activeorder.sell)+availableBalance,maxMargin);
        availbuy = (maxuse-activeorder.buy)*value/100;
        availsell = (maxuse-activeorder.sell)*value/100;
      }else if(parseFloat(symbolPosition.positionAmt)>0){
        availbuyValue = maxMargin-symbolPosition.positionAmt*symbolPosition.entryPrice*levValue-activeorder.buy
        availsellValue = maxMargin+symbolPosition.positionAmt*symbolPosition.entryPrice*levValue- activeorder.sell
        availbuy = Math.min(Math.abs(Math.min(2*positionMargin+ activeorder.buy-activeorder.sell,0))+availableBalance,availbuyValue)*value/100;;
        availsell = Math.min(Math.abs(Math.min(activeorder.sell-activeorder.buy-2*positionMargin,0))+availableBalance,availsellValue)*value/100;;
      }else{
        availbuyValue = maxMargin+symbolPosition.positionAmt*symbolPosition.entryPrice*levValue-activeorder.buy
        availsellValue = maxMargin-symbolPosition.positionAmt*symbolPosition.entryPrice*levValue-activeorder.sell
        availbuy = Math.min(Math.abs(Math.min(activeorder.buy-activeorder.sell-2*positionMargin,0))+availableBalance,availbuyValue)*value/100;
        availsell = Math.min(Math.abs(Math.min(2*positionMargin+activeorder.sell-activeorder.buy,0))+availableBalance,availsellValue)*value/100;
      }
      //console.log(availbuy,availsell)
  
        if(parseFloat(action.payload.price)>parseFloat(symbolPosition.markPrice)){
          sellamount= (parseInt((availsell/(action.payload.price*levValue+Math.abs(Math.min(0,-1*(symbolPosition.markPrice-action.payload.price)))))*Math.pow(10,symbolPosition.quantityPrecision)))/Math.pow(10,symbolPosition.quantityPrecision)
          buyamount = (parseInt((availbuy/(action.payload.price*levValue+Math.abs(Math.min(0,(symbolPosition.markPrice-action.payload.price)))))*Math.pow(10,symbolPosition.quantityPrecision)))/Math.pow(10,symbolPosition.quantityPrecision)
        }else{
          sellamount = (parseInt((availsell/(Math.max(asks[0].price,symbolPosition.markPrice)*levValue+Math.abs(Math.min(0,-1*(symbolPosition.markPrice-action.payload.price)))))*Math.pow(10,symbolPosition.quantityPrecision)))/Math.pow(10,symbolPosition.quantityPrecision)
          buyamount =  (parseInt((availbuy/(action.payload.price*levValue+Math.abs(Math.min(0,(symbolPosition.markPrice-action.payload.price)))))*Math.pow(10,symbolPosition.quantityPrecision)))/Math.pow(10,symbolPosition.quantityPrecision)
        }
    }
    if(action.payload.tradeType ==='sell' &&sellamount>0){
      yield put({
        type:"api/SUMMIT_ORDER",
        payload:{
          type: 'Limit',
          isMarket: false,
          symbol: action.payload.symbol,
          price: action.payload.price,
          amount: sellamount,
          side: 'sell',
          isReduce: isReduce,
          isPost: false
        }
      })
      
    }else if(action.payload.tradeType ==='buy' &&buyamount>0){
      yield put({
        type:"api/SUMMIT_ORDER",
        payload:{
          type: 'Limit',
          isMarket: false,
          symbol: action.payload.symbol,
          price: action.payload.price,
          amount: buyamount,
          side: 'buy',
          isReduce: isReduce,
          isPost: false
        }
      })
    
    }

    yield put({
      type:'trade/CHANGE_ORDERBOOK_ORDER_VALUE',
      payload:{
        value:'',
        slider:''
      }
    })
  
    
  }else if(amountsym !=='' &&  value ===''){
    if(parseFloat(amountsym)>0){
      if(action.payload.tradeType ==='sell'){
        yield put({
          type:"api/SUMMIT_ORDER",
          payload:{
            type: 'Limit',
            isMarket: false,
            symbol: action.payload.symbol,
            price: action.payload.price,
            amount: amountsym,
            side: 'sell',
            isReduce: isReduce,
            isPost: false
          }
        })
       
      }else if(action.payload.tradeType ==='buy'){
       
        yield put({
          type:"api/SUMMIT_ORDER",
          payload:{
            type: 'Limit',
            isMarket: false,
            symbol: action.payload.symbol,
            price: action.payload.price,
            amount: amountsym,
            side: 'buy',
            isReduce: isReduce,
            isPost: false
          }
        })
      
      }
    }
  }




}


export function * orderbookOrdersaga () {
  yield all([takeEvery('orderbook/SUMMIT_ORDERBOOK_ORDER', summitOrderbookOrder)]);
}

const orderbookOrderSagas = [orderbookOrdersaga()];
export default orderbookOrderSagas;
