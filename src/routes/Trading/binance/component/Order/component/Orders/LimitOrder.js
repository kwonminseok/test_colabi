import React, { useCallback,useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import AmountInput from './component/AmountInput';
import NumberInput from './component/NumberInput';
import AmountSlider from './component/AmountSlider';
import Selector from './component/Selector';
import BuyButton from './component/BuyButton';
import SellButton from './component/SellButton';
import OnlyCheckBox from './component/OnlyCheckBox'
import Notvalid from './component/Notvalid';
import Notlog from './component/Notlog'
import CostView from './component/CostView'
import AmountView from './component/AmountView';
import TrigerPriceDropdown from './component/TrigerPriceDropdown';
import KlineTimeDrop from './component/KlineTimeDrop'
import KlineDropdown from './component/KlineDropdown';
const PRICE = 'Price'
const STOP_PRICE = 'Stop Price'
const REACH_PRICE = 'Reach Price'
const CLOSE_PRICE = 'Close Price'
const POST_ONLY ='Post-Only'
const REDUCE_ONLY = 'Reduce-Only'

const MARKET_OPTION = [
    {
      label: 'Limit',
      value: false,
      selectedBackgroundColor: '#58b589',
    },
    {
      label: 'Market',
      value: true,
      selectedBackgroundColor: '#58b589',
    },
];

const RESERVE_OPTION = [
    {
      label: 'Triger',
      value: false,
      selectedBackgroundColor: '#58b589',
    },
    {
      label: 'Kline',
      value: true,
      selectedBackgroundColor: '#58b589',
    },
  ];


  const Last_PRICE_LIST = [{value: "last Price", label: 'Last Price',className: 'last-drop-option'},
  {value: 'mark price', label: 'Mark Price',className: 'last-drop-option'}]

  const KLINE_TIME_LIST = [
      {value: '5m', label: '5m',className: 'last-drop-option'},
      {value: '15m', label: '15m',className: 'last-drop-option'},
      {value: '30m', label: '30m',className: 'last-drop-option'},
      {value: '1h', label: '1h',className: 'last-drop-option'},
      {value: '4h', label: '4h',className: 'last-drop-option'}
  ]

  const KLINE_DIRECTION_LIST = [
    {value: 'up', label: 'up',className: 'last-drop-option'},
    {value: 'down', label: 'down',className: 'last-drop-option'}
  ]
const LimitOrder = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const [buyCost, setBuyCost] = useState(0);
    const [sellCost, setSellCost] = useState(0);
    const [buyAmount, setBuyAmount] = useState(0);
    const [sellAmount, setSellAmount] = useState(0);
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
    },[symbolPosition,orderdata,userActiveOrder,availableBalance,bids,asks,symbol])

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
    
    },[symbol,symbolPosition,userActiveOrder,orderdata,bids,asks,]);

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
    },[exchangeInfo,maxlength,orderdata,dispatch])

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
      }
    ,[exchangeInfo.quantityPrecision,maxlength])
    
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

    const handleTrigerChange = useCallback((e)=> {
        const a = checkSubPrice(e.target.value)
        if(a !=='no' && a!== undefined){
            dispatch({
                type:'order/CHANGE_TRIGER',
                payload:a
            })
        }
    },[checkSubPrice,dispatch])

    const handleReachChange = useCallback((e)=> {
        const a = checkSubPrice(e.target.value)
        if(a !=='no' && a!== undefined){
            dispatch({
                type:'order/CHANGE_REACH',
                payload:a
            })
        }
        
    },[checkSubPrice,dispatch])

    const handleBaseChange = useCallback((e)=> {
        const a = checkSubPrice(e.target.value)
        if(a !=='no' && a!== undefined){
            dispatch({
                type:'order/CHANGE_BASE',
                payload:a
            })
        }
    },[checkSubPrice,dispatch])

    const handlePriceChange = useCallback((e)=> {
        const a = checkPrice(e.target.value);
        if(a !=='no' && a!== undefined){
            dispatch({
                type:'order/SET_PRICE',
                payload:a
            })
        }
    },[checkPrice,dispatch])

    const handleAmountChange = useCallback((e) => {
        if(userstatus ==='cantrade'){
            const a = checkAmount(e.target.value)
            if(a !=='no' && a!== undefined){
                dispatch({
                    type:'order/CHANGE_AMOUNT',
                    payload:a
                })
                setBuyAmount(a);
                setSellAmount(a);
            }
        }
    },[userstatus,dispatch,checkAmount])

    const handleIsPostChange = useCallback(() => {
        dispatch({
            type:"order/CHANGE_ISPOST",
            payload: !(orderdata.isPost)
        })
    },[orderdata.isPost,dispatch])

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
    },[orderdata.isReduce,dispatch])
    
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

    },[orderdata,symbolPosition,walletBalance,userstatus,dispatch])
    
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

    return(
        <>
        {orderdata.active !== 'reservation'? 
        <div className='flex'>
            <div style={{ flex: '3', zIndex: '0' }}>
                <Selector
                option = {MARKET_OPTION}
                handleChange={handleIsMarketChange}
                index={orderdata.isMarket}
                active={orderdata.active}
                />
            </div>
            <div className='flex-2'></div>
        </div>
        : 
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
            <div className='flex-1' style={{ zIndex: '0', padding: '0 2px' }}>
                <Selector
                    option = {RESERVE_OPTION}
                    handleChange={handleIsKlineChange}
                    index={orderdata.isKline}
                    active={orderdata.active}
                />
            </div>
            <div className='flex-1' style={{ zIndex: '0', padding: '0 2px' }}>
            <Selector
                    option = {MARKET_OPTION}
                    handleChange={handleIsMarketChange}
                    index={orderdata.isMarket}
                    active={orderdata.active}
                />
            </div>
        </div>
        }
        {orderdata.active === 'reservation' && orderdata.isKline?
        <div className="flex" style={{marginTop:"20px"}}>
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
        {orderdata.active ==='stop'?
            <NumberInput
                name={STOP_PRICE}
                handleChange={handleTrigerChange}
                price={orderdata.triger}
            />:
            orderdata.active === 'reservation'?
            orderdata.isKline?
               <NumberInput
                    name={CLOSE_PRICE}
                    handleChange={handleBaseChange}
                    price={orderdata.base}
                />
                :<>
                <NumberInput
                     name={REACH_PRICE}
                     handleChange={handleReachChange}
                     price={orderdata.reach}
                 />
                <NumberInput
                     name={STOP_PRICE}
                     handleChange={handleTrigerChange}
                     price={orderdata.triger}
                 />
                </>
        :<></>
        }
        {orderdata.isMarket?
        <></>:
        <NumberInput
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
        <AmountSlider
            handlePercent={handlePercent}
            value={orderdata.value}
        />
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
        {isLoggedIn ? userstatus ==='cantrade'? 
        <>
        <div className='orderbuttonlist'>
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
        <div className='flex orderbookbor'>
            {!orderdata.isMarket && orderdata.active ==='Limit'? 
            <OnlyCheckBox
                isCheck={orderdata.isPost}
                handleChange={handleIsPostChange}
                id={'order-post-only'} 
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
                id={'order-reduce-only'} 
                label={REDUCE_ONLY}
            />
           
        </div>
        </>
        :<Notvalid
            userstatus={userstatus}
            t={t}
        />
        :<Notlog
            userstatus={userstatus}
            t={t}
        />
        }
        </>
    )
}

export default LimitOrder;