import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import TypeSelector from './component/TypeSelector'
import PriceInput from './component/PriceInput'
import ButtonSlider from './component/ButtonSlider'
import AmountInput from './component/AmountInput'
import OnlyCheckBox from '../../../../../Order/component/Orders/component/OnlyCheckBox'
import TrigerPriceDropdown from '../../../../../Order/component/Orders/component/TrigerPriceDropdown'
import BuyButton from '../../../../../Order/component/Orders/component/BuyButton'
import SellButton from '../../../../../Order/component/Orders/component/SellButton'
import CostView from '../../../../../Order/component/Orders/component/CostView'
import KlineTimeDrop from './component/KlineTimeDrop'
import KlineDropdown from './component/KlineDropdown'
import AmountView from '../../../../../Order/component/Orders/component/AmountView'
const PRICE = 'Price';
const STOP_PRICE = 'Stop Price';
const REACH_PRICE = 'Reach Price';
const CLOSE_PRICE = 'Close Price';
const POST_ONLY = 'Post-Only';
const REDUCE_ONLY = 'Reduce-Only';



const Last_PRICE_LIST = [
  { value: 'last Price', label: 'Last Price', className: 'mob-drop-option' },
  { value: 'mark price', label: 'Mark Price', className: 'mob-drop-option' },
];

const KLINE_TIME_LIST = [
  { value: '5m', label: '5m', className: 'mob-drop-option' },
  { value: '15m', label: '15m', className: 'mob-drop-option' },
  { value: '30m', label: '30m', className: 'mob-drop-option' },
  { value: '1h', label: '1h', className: 'mob-drop-option' },
  { value: '4h', label: '4h', className: 'mob-drop-option' },
];

const KLINE_DIRECTION_LIST = [
  { value: 'up', label: 'up', className: 'mob-drop-option' },
  { value: 'down', label: 'down', className: 'mob-drop-option' },
];

const Order = () => {
  const [buyCost, setBuyCost] = useState(0);
  const [sellCost, setSellCost] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const { t, i18n } = useTranslation();
  const {asks, bids, isLoggedIn, userstatus, symbol, exchangeInfo, maxlength, orderdata, symbolPosition, walletBalance, availableBalance, userActiveOrder } = useSelector(state =>({
    asks:state.orderbook.asks.slice(0,1),
    bids:state.orderbook.bids.slice(0,1),
    isLoggedIn: state.user.isLoggedIn,
    userstatus: state.user.userstatus,
    symbol: state.trade.symbol,
    exchangeInfo: state.trade.exchangeInfo,
    maxlength: state.trade.maxlength,
    orderdata: state.order,
    symbolPosition: state.user.userBalance.symbolPosition,
    walletBalance: state.user.userBalance.walletBalance,
    availableBalance: state.user.userBalance.availableBalance,
    userActiveOrder: state.user.userMargin.activeOrder
  }))

  //const asks = useSelector(state => state.orderbook.asks.slice(0,1))
  //const bids = useSelector(state => state.orderbook.bids.slice(0,1))
  //const orderdata = useSelector(state => state.order)
  //const exchangeInfo = useSelector(state => state.trade.exchangeInfo)
  //const maxlength = useSelector(state => state.trade.maxlength)
 // const symbol = useSelector(state => state.trade.symbol);
  //const userstatus = useSelector(state => state.user.userstatus)
  //const symbolPosition = useSelector(state => state.user.userBalance.symbolPosition)
  //const walletBalance= useSelector(state => state.user.userBalance.walletBalance)
  //const availableBalance  = useSelector(state => state.user.userBalance.availableBalance)
  //const userActiveOrder = useSelector(state => state.user.userMargin.activeOrder)
  const dispatch = useDispatch();

  useEffect(() => {
    if(userstatus === 'cantrade' && ((orderdata.price !== '' && parseFloat(orderdata.price) !==0) || orderdata.isMarket)){
        if(orderdata.value !==0 && orderdata.value !== ''){
            calcSliderAmount();
        }else if( (orderdata.value ===0 ||orderdata.value ==='')&&(orderdata.amount !=='0%'&&orderdata.amount !=='')){
            calCost(buyAmount,sellAmount)
        }
    }
    if(orderdata.amount === '' && orderdata.value === ''){
      if(parseFloat(sellAmount) !== 0 || parseFloat(buyAmount) !== 0){
        setSellAmount(0);
        setBuyAmount(0);
        setBuyCost(0)
        setSellCost(0) 
      }
    }
  }, [symbol,userstatus,orderdata,symbolPosition,asks,bids,userActiveOrder,buyAmount,sellAmount]);


  const calcSliderAmount = useCallback(() => {
    const levValue = Math.ceil((1 / symbolPosition.leverage) * 10000) / 10000;
    var maxMargin;
        if(symbolPosition.maxNotionalValue ==="INF"){
          maxMargin = Math.pow(10,10);
        }else{
          maxMargin = symbolPosition.maxNotionalValue*levValue;
        }
    var activeorder = _.find(userActiveOrder,function(o){
        return o.symbol === symbol
    })
    let positionMargin = symbolPosition.positionMargin
    let longprice = bids[0].price*1.0005
    let shortprice = Math.max(symbolPosition.markPrice,asks[0].price)
    let availbuy =0;
    let availsell =0;
    let availbuyValue =0;
    let availsellValue = 0;
    let maxuse=0;
    let buyamount =0;
    let sellamount =0;
    let sellusdt = 0;
    let buyusdt = 0;
    let sellall =0;
    let buyall =0;

    if(orderdata.isReduce){
      if(parseFloat(symbolPosition.positionAmt)>0){
        sellamount = parseFloat(symbolPosition.positionAmt*orderdata.value/100).toFixed(symbolPosition.quantityPrecision)
      }else{
        buyamount = parseFloat(Math.abs(symbolPosition.positionAmt)*orderdata.value/100).toFixed(symbolPosition.quantityPrecision)
      }
    }else{
      if(parseFloat(symbolPosition.positionAmt) ===0){
        maxuse = Math.min(Math.max(activeorder.buy,activeorder.sell)+availableBalance,maxMargin);
        availbuy = (maxuse-activeorder.buy)*orderdata.value/100;
        availsell = (maxuse-activeorder.sell)*orderdata.value/100;
      }else if(parseFloat(symbolPosition.positionAmt)>0){
        availbuyValue = maxMargin-symbolPosition.positionAmt*symbolPosition.entryPrice*levValue-activeorder.buy
        availsellValue = maxMargin+symbolPosition.positionAmt*symbolPosition.entryPrice*levValue- activeorder.sell
        availbuy = Math.min(Math.abs(Math.min(2*positionMargin+ activeorder.buy-activeorder.sell,0))+availableBalance,availbuyValue)*orderdata.value/100;;
        availsell = Math.min(Math.abs(Math.min(activeorder.sell-activeorder.buy-2*positionMargin,0))+availableBalance,availsellValue)*orderdata.value/100;;
      }else{
        availbuyValue = maxMargin+symbolPosition.positionAmt*symbolPosition.entryPrice*levValue-activeorder.buy
        availsellValue = maxMargin-symbolPosition.positionAmt*symbolPosition.entryPrice*levValue-activeorder.sell
        availbuy = Math.min(Math.abs(Math.min(activeorder.buy-activeorder.sell-2*positionMargin,0))+availableBalance,availbuyValue)*orderdata.value/100;
        availsell = Math.min(Math.abs(Math.min(2*positionMargin+activeorder.sell-activeorder.buy,0))+availableBalance,availsellValue)*orderdata.value/100;
      }
      //console.log(availbuy,availsell) 
      if(orderdata.isMarket){
          buyamount =(parseInt((availbuy/(longprice*levValue+Math.abs(Math.min(0,(symbolPosition.markPrice-longprice))))*Math.pow(10,symbolPosition.quantityPrecision))))/Math.pow(10,symbolPosition.quantityPrecision)
          sellamount = (parseInt((availsell/(shortprice*levValue+Math.abs(Math.min(0,-1*(symbolPosition.markPrice-shortprice)))))*Math.pow(10,symbolPosition.quantityPrecision)))/Math.pow(10,symbolPosition.quantityPrecision)
      }else{
        if(parseFloat(orderdata.price)>parseFloat(symbolPosition.markPrice)){
          sellamount= (parseInt((availsell/(orderdata.price*levValue+Math.abs(Math.min(0,-1*(symbolPosition.markPrice-orderdata.price)))))*Math.pow(10,symbolPosition.quantityPrecision)))/Math.pow(10,symbolPosition.quantityPrecision)
          buyamount = (parseInt((availbuy/(orderdata.price*levValue+Math.abs(Math.min(0,(symbolPosition.markPrice-orderdata.price)))))*Math.pow(10,symbolPosition.quantityPrecision)))/Math.pow(10,symbolPosition.quantityPrecision)
        }else{
          sellamount = (parseInt((availsell/(Math.max(asks[0].price,symbolPosition.markPrice)*levValue+Math.abs(Math.min(0,-1*(symbolPosition.markPrice-orderdata.price)))))*Math.pow(10,symbolPosition.quantityPrecision)))/Math.pow(10,symbolPosition.quantityPrecision)
          buyamount =  (parseInt((availbuy/(orderdata.price*levValue+Math.abs(Math.min(0,(symbolPosition.markPrice-orderdata.price)))))*Math.pow(10,symbolPosition.quantityPrecision)))/Math.pow(10,symbolPosition.quantityPrecision)
         
        }
      }
    }


      setBuyAmount(buyamount);
      setSellAmount(sellamount);

      if(orderdata.isMarket){
        longprice = bids[0].price*1.0005
        shortprice = Math.max(symbolPosition.markPrice,asks[0].price);
        buyusdt = longprice *buyamount*levValue + buyamount* Math.abs(Math.min(0,(symbolPosition.markPrice-longprice)))
        sellusdt = shortprice*sellamount*levValue + sellamount*Math.abs(Math.min(0,-1*(symbolPosition.markPrice-shortprice)))
    }else{
        if(parseFloat(orderdata.price)>parseFloat(symbolPosition.markPrice)){
          sellusdt = orderdata.price*sellamount*levValue +sellamount*Math.abs(Math.min(0,-1*(symbolPosition.markPrice-orderdata.price)))
          buyusdt = orderdata.price*buyamount*levValue+ buyamount*Math.abs(Math.min(0,(symbolPosition.markPrice-orderdata.price)))
        }else{
          sellusdt = Math.max(asks[0].price,symbolPosition.markPrice)*sellamount*levValue+ sellamount*Math.abs(Math.min(0,-1*(symbolPosition.markPrice-orderdata.price)))
          buyusdt = orderdata.price*buyamount*levValue+ buyamount*Math.abs(Math.min(0,(symbolPosition.markPrice-orderdata.price)))
        }
      }

      if(parseFloat(symbolPosition.positionAmt)>=0){
        sellall = Math.min(0,activeorder.sell-2*positionMargin-activeorder.buy)+sellusdt
        buyall = Math.min(0,activeorder.buy+2*positionMargin-activeorder.sell)+buyusdt
      }else if(parseFloat(symbolPosition.positionAmt)<0){
        sellall = Math.min(0,activeorder.sell+2*positionMargin-activeorder.buy)+sellusdt
        buyall = Math.min(0,activeorder.buy-2*positionMargin-activeorder.sell)+buyusdt
      }
      
      setBuyCost(Math.max(0,buyall)) 
      setSellCost(Math.max(0,sellall)) 
    //   calCost(buyamount,sellamount);
},[symbolPosition,userActiveOrder,availableBalance,bids,asks,orderdata.value,orderdata.price,orderdata.isMarket,symbol])

  const calCost = useCallback((buyamount,sellamount)=>{
    const levValue = Math.ceil((1 / symbolPosition.leverage) * 10000) / 10000;
    var activeorder = _.find(userActiveOrder,function(o){
        return o.symbol === symbol
    })
    let positionMargin = symbolPosition.positionMargin
    let longprice = bids[0].price*1.0005
    let shortprice = Math.max(symbolPosition.markPrice,asks[0].price);
    let sellusdt = 0;
    let buyusdt = 0;
    let sellall =0;
    let buyall =0;
    if(orderdata.isMarket){
        buyusdt = longprice *buyamount*levValue + buyamount* Math.abs(Math.min(0,(symbolPosition.markPrice-longprice)))
        sellusdt = shortprice*sellamount*levValue + sellamount*Math.abs(Math.min(0,-1*(symbolPosition.markPrice-shortprice)))
    }else{
        if(parseFloat(orderdata.price)>parseFloat(symbolPosition.markPrice)){
          sellusdt = orderdata.price*sellamount*levValue +sellamount*Math.abs(Math.min(0,-1*(symbolPosition.markPrice-orderdata.price)))
          buyusdt = orderdata.price*buyamount*levValue+ buyamount*Math.abs(Math.min(0,(symbolPosition.markPrice-orderdata.price)))
        }else{
          sellusdt = Math.max(asks[0].price,symbolPosition.markPrice)*sellamount*levValue+ sellamount*Math.abs(Math.min(0,-1*(symbolPosition.markPrice-orderdata.price)))
          buyusdt = orderdata.price*buyamount*levValue+ buyamount*Math.abs(Math.min(0,(symbolPosition.markPrice-orderdata.price)))
        }
      }

      if(parseFloat(symbolPosition.positionAmt)>=0){
        sellall = Math.min(0,activeorder.sell-2*positionMargin-activeorder.buy)+sellusdt
        buyall = Math.min(0,activeorder.buy+2*positionMargin-activeorder.sell)+buyusdt
      }else if(parseFloat(symbolPosition.positionAmt)<0){
        sellall = Math.min(0,activeorder.sell+2*positionMargin-activeorder.buy)+sellusdt
        buyall = Math.min(0,activeorder.buy-2*positionMargin-activeorder.sell)+buyusdt
      }
      
      setBuyCost(Math.max(0,buyall)) 
      setSellCost(Math.max(0,sellall)) 

},[symbolPosition,userActiveOrder,orderdata,bids,asks,symbol]);


const submitBuyOrder = useCallback(() => {
  dispatch({
    type:"api/SUMMIT_ORDER",
    payload:{
      type: orderdata.active,
      symbol: symbol,
      isMarket: orderdata.isMarket,
      price: orderdata.price,
      triger: orderdata.triger,
      reach: orderdata.reach,
      base: orderdata.base,
      kline: orderdata.kline,
      klineDirection: orderdata.klineDirection,
      side: 'buy',
      isReduce: orderdata.isReduce,
      isPost: orderdata.isPost,
      isKline: orderdata.isKline,
      amount: buyAmount,
      mark: symbolPosition.markPrice,
      trigerprice: orderdata.trigerprice
    }
  })
},[dispatch,orderdata,symbol,symbolPosition,buyAmount])

const submitSellOrder = useCallback(() => {
  dispatch({
    type:"api/SUMMIT_ORDER",
    payload:{
      type: orderdata.active,
        symbol: symbol,
        isMarket: orderdata.isMarket,
        price: orderdata.price,
        triger: orderdata.triger,
        reach: orderdata.reach,
        base: orderdata.base,
        kline: orderdata.kline,
        klineDirection: orderdata.klineDirection,
        side: 'sell',
        isReduce: orderdata.isReduce,
        isPost: orderdata.isPost,
        isKline: orderdata.isKline,
        amount: sellAmount,
        mark: symbolPosition.markPrice,
        trigerprice: orderdata.trigerprice
    }
  })
},[dispatch,orderdata,sellAmount,symbolPosition,symbol])


  const checkSubPrice = useCallback((value) => {
    const firstre = /^[0-9\b]+$/
    const check3 = value.split('.');
    if(value.length === 0){
      return value
    }else if(check3.length ===1){
      if(firstre.test(check3[0]) &&check3[0].length<=maxlength){
        return parseInt(check3[0]).toString()//this.props.setPrice(value)        
      }
    }else if(check3.length ===2){
      let a =0;
        if(check3[0].length<=maxlength && (firstre.test(check3[0]) || check3[0] === '')){
          if(firstre.test(check3[0])){
            a = parseFloat(check3[0]);
          }
          if(firstre.test(check3[1]) || check3[1] === ''){
            if(check3[1].length>exchangeInfo.pricePrecision){
              return a+'.'+check3[1].slice(0,exchangeInfo.pricePrecision)//this.props.setPrice(a+'.'+check3[1].slice(0,exchangeInfo.pricePrecision))
            }else{
              return a+'.'+check3[1]//this.props.setPrice(a+'.'+check3[1])
            }
          }
        }
    }else return 'no';
},[exchangeInfo,maxlength])

  const checkPrice = useCallback((value) => {
    const firstre = /^[0-9\b]+$/
    const check3 = value.split('.');
    if(value.length === 0){
      let a = orderdata.amount.indexOf('%');
      if(a === -1){
          dispatch({
              type: 'order/CHANGE_PERCENT',
              payload:{value:0,amount: orderdata.amount}
          })
      }else{
        dispatch({
            type: 'order/CHANGE_PERCENT',
            payload:{value:0,amount: ''}
        })
      }
      return value
    }else if(check3.length ===1){
      if(firstre.test(check3[0]) &&check3[0].length<=maxlength){
        if(parseFloat(check3[0])===0){
          let a = orderdata.amount.indexOf('%');
          if(a === -1){
            dispatch({
                type: 'order/CHANGE_PERCENT',
                payload:{value:0,amount: orderdata.amount}
            })
          }else{
            dispatch({
                type: 'order/CHANGE_PERCENT',
                payload:{value:0,amount: ''}
            })
          }
        } 
        return parseInt(check3[0]).toString()//this.props.setPrice(value)        
      }
    }else if(check3.length ===2){
      let a =0;
        if(check3[0].length<=maxlength && (firstre.test(check3[0]) || check3[0] === '')){
          if(firstre.test(check3[0])){
            a = parseFloat(check3[0]);
          }
          if(firstre.test(check3[1]) || check3[1] === ''){
            if(check3[1].length>exchangeInfo.pricePrecision){
              return a+'.'+check3[1].slice(0,exchangeInfo.pricePrecision)//this.props.setPrice(a+'.'+check3[1].slice(0,exchangeInfo.pricePrecision))
            }else{
              return a+'.'+check3[1]//this.props.setPrice(a+'.'+check3[1])
            }
          }
        }
    }else return 'no';
  },[dispatch,exchangeInfo,maxlength,orderdata])

  const checkAmount = useCallback((value) => {
    const firstre = /^[0-9\b]+$/
    const check3 = value.split('.');
    if(value.length ===0){
        setBuyCost(0)
        setSellCost(0)
      return value//this.props.changeAmount({value})
    }else if(check3.length ===1){
      if(firstre.test(check3[0]) &&check3[0].length<=maxlength){
        return parseInt(check3[0]).toString()//this.props.setPrice(value)        
      }
    }else if(check3.length ===2){
      let a =0;
        if(check3[0].length<=maxlength && (firstre.test(check3[0]) || check3[0] === '')){
          if(firstre.test(check3[0])){
            a = parseFloat(check3[0]);
          }
          if(firstre.test(check3[1]) || check3[1] === ''){
            if(check3[1].length>exchangeInfo.quantityPrecision){
              return a+'.'+check3[1].slice(0,exchangeInfo.quantityPrecision)
            }else{
              return a+'.'+check3[1]
            }
          }
        }
    }else return 'no';
  },[exchangeInfo.quantityPrecision,maxlength])

  const handleReachChange = useCallback((e)=> {
    const a = checkSubPrice(e.target.value)
    if(a !=='no' && a!== undefined){
        dispatch({
            type:'order/CHANGE_REACH',
            payload:a
        })
    }
    
  },[dispatch,checkSubPrice])

  const handleIsMarketChange = useCallback((newValue)=> {

    dispatch({
        type:'order/CHANGE_ISMARKET',
        payload:newValue
    })
    dispatch({
        type:'order/CHANGE_PERCENT',
        payload:{
            amount :'',
            value: 0
        }
    })
    if(newValue){
        dispatch({
            type:'order/CHANGE_ISPOST',
            payload:false
        })
    }
},[dispatch])

  const handleTrigerChange = useCallback((e)=> {
    const a = checkSubPrice(e.target.value)
    if(a !=='no' && a!== undefined){
        dispatch({
            type:'order/CHANGE_TRIGER',
            payload:a
        })
    }
  },[dispatch,checkSubPrice])

  const handleBaseChange = useCallback((e)=> {
    const a = checkSubPrice(e.target.value)
    if(a !=='no' && a!== undefined){
        dispatch({
            type:'order/CHANGE_BASE',
            payload:a
        })
    }
},[dispatch,checkSubPrice])

  const handlePriceChange = useCallback((e)=> {
    const a = checkPrice(e.target.value);

    if(a !=='no' && a!== undefined){
        dispatch({
            type:'order/SET_PRICE',
            payload:a
        })
    }
  },[dispatch,checkPrice])

  const handleAmountChange = useCallback((e) => {
    if(userstatus ==='cantrade'){
        const a = checkAmount(e.target.value)
        if( a !=='no' && a!== undefined){
            dispatch({
                type:'order/CHANGE_AMOUNT',
                payload:a
            })
            setBuyAmount(a);
            setSellAmount(a);
        }
    }
},[dispatch,checkAmount,userstatus])

  const handlePercent = useCallback((value)=> {

    if(userstatus === 'cantrade' && symbolPosition !==undefined && walletBalance !== undefined){
        if( (parseFloat(orderdata.price)>0 || orderdata.isMarket) && ( (orderdata.isReduce && parseFloat(symbolPosition.positionAmt)!==0) || (!orderdata.isReduce && parseFloat(walletBalance)>0) )){
            if(value === 0){
        
                setBuyCost(0)
                setSellCost(0)
            }
            dispatch({
                type:'order/CHANGE_PERCENT',
                payload:{
                    amount :value+'%',
                    value: value
                }
            })
        }
    }

  },[dispatch,userstatus,orderdata,symbolPosition,walletBalance])

  const handleIsPostChange = useCallback(() => {
    dispatch({
        type:"order/CHANGE_ISPOST",
        payload: !(orderdata.isPost)
    })
  },[dispatch,orderdata.isPost])

  const handleIsReduceChange = useCallback(() =>{

    dispatch({
        type:"order/CHANGE_ISREDUCE",
        payload: !(orderdata.isReduce)
    })
    dispatch({
        type:'order/CHANGE_AMOUNT',
        payload:''

    })
    setBuyCost(0)
    setSellCost(0)
},[dispatch,orderdata.isReduce])

  const handleIsKlineChange = useCallback((newValue)=> {

    dispatch({
        type:'order/CHANGE_ISKLINE',
        payload:newValue
    })
    dispatch({
        type:'order/CHANGE_PERCENT',
        payload:{
            amount :'',
            value: 0
        }
    })
  },[dispatch])

  const changeTriger = useCallback((value) => {
    dispatch({
        type:'order/CHANGE_TRIGER_PRICE',
        payload: value.value
    })
  },[dispatch])

  const changeKlineTime = useCallback((value) => {
    dispatch({
        type:'order/CHANGE_KLINE',
        payload: value.value
    })
},[dispatch])

const changeKlineDirection = useCallback((value) => {
    
    dispatch({
        type:'order/CHANGE_KLINE_DIRECTION',
        payload: value.value
    })
},[dispatch])

  return (
    <>
     {orderdata.active !== 'reservation'? 
      <div className="flex" style={{paddingLeft:"14px"}}>
        <TypeSelector
          first='Limit'
          second='Market'
          isActive={orderdata.isMarket}
          handleChange={handleIsMarketChange}
        />
      </div>
      :
      <div className="flex" style={{paddingLeft:"14px", paddingRight:"14px"}}>
        <div className="flex flex-1" style={{justifyContent:"center"}}>
          <TypeSelector
            first='Triger'
            second='Kline'
            isActive={orderdata.isKline}
            handleChange={handleIsKlineChange}
          />
        </div>
        <div className="flex flex-1" style={{justifyContent:"center"}}>
          <TypeSelector
            first='Limit'
            second='Market'
            isActive={orderdata.isMarket}
            handleChange={handleIsMarketChange}
          />
        </div>
      </div>
      }
      {orderdata.active === 'reservation' && orderdata.isKline?
        <div className="flex" style={{marginTop:"10px"}}>
        <KlineTimeDrop
            options={KLINE_TIME_LIST}
            kline={orderdata.kline}
            changeValue={changeKlineTime}
        />
        <KlineDropdown
            options={KLINE_DIRECTION_LIST}
            direction={orderdata.klineDirection}
            changeValue={changeKlineDirection}
        />
        </div> :<></>
        }

      {orderdata.active === 'stop'?
        <PriceInput
          name={STOP_PRICE}
          handleChange={handleTrigerChange}
          price={orderdata.triger}        
        />
      : orderdata.active === 'reservation'?
      orderdata.isKline?
        <PriceInput
          name={CLOSE_PRICE}
          handleChange={handleBaseChange}
          price={orderdata.base}
        />:
        <>
          <PriceInput
           name={REACH_PRICE}
           handleChange={handleReachChange}
           price={orderdata.reach}/>
          <PriceInput
           name={STOP_PRICE}
           handleChange={handleTrigerChange}
           price={orderdata.triger}
           />
        </>
      :<></>
      }
      {orderdata.isMarket?
        <></>:
        <PriceInput
            name={PRICE}
            handleChange={handlePriceChange}
            price={orderdata.price}
        />
      }
      <AmountInput
        handleAmountChange={handleAmountChange}
        amount={orderdata.amount}
        symbol={symbol} 
      />
      <div style={{ margin: '10px 10px 10px 14px',display:"flex" }} className='orderbookorder'>
        <ButtonSlider percent={25} handleClick={()=>handlePercent(25)}/>
        <ButtonSlider percent={50} handleClick={()=>handlePercent(50)}/>
        <ButtonSlider percent={75} handleClick={()=>handlePercent(75)}/>
        <ButtonSlider percent={100} handleClick={()=>handlePercent(100)}/>
      </div>
      {orderdata.value !== 0 && orderdata.value !==''?
        <div className="amount0axb">
            <div className="buya0xbmount">
                <AmountView
                amount ={buyAmount}
                symbol = {symbol}
                side= {'Buy'}
                />
            </div>
            <div className="sella0xbmount">
                <AmountView 
                 amount ={sellAmount}
                 symbol = {symbol}
                 side= {'Sell'}
                />
            </div>
        </div>
        :<></>
        }
      <div className='mob-orderbuttonlist'>
            <BuyButton
                submitOrder={submitBuyOrder}
                t={t}
            />
            <SellButton
                submitOrder ={submitSellOrder}
                t={t}
            />
      </div>
      <div className='amount0axb'>
            <div className="buya0xbmount">
            <CostView
                cost ={buyCost}
                t={t}
            />
            </div>
            <div className="sella0xbmount">
                <CostView
                  cost ={sellCost}
                  t={t}
            />
            </div>
      </div>
      <div className="mob-avail-box">
        <div>{t('wallet.available')}</div>
        <div className="mob-avail flex-1">{parseFloat(walletBalance).toFixed(2)} USDT</div>
      </div>
      <div className='flex mob-orderbookbor'>
            {!orderdata.isMarket && orderdata.active ==='Limit'? 
            <OnlyCheckBox
                isCheck={orderdata.isPost}
                handleChange={handleIsPostChange}
                id={'mob-order-post-only'} 
                label={POST_ONLY}
            />
            :<></>
            }
            {orderdata.active ==='stop' || (orderdata.active === 'reservation' && !orderdata.isKline) ?
                <TrigerPriceDropdown 
                    options={Last_PRICE_LIST}
                    value ={orderdata.trigerprice}
                    changeValue={changeTriger}
                />
                :<></>
            }
            <OnlyCheckBox
                isCheck={orderdata.isReduce}
                handleChange={handleIsReduceChange}
                id={'mob-order-reduce-only'} 
                label={REDUCE_ONLY}
            />
           
        </div>
    </>
  );
};

export default Order;
