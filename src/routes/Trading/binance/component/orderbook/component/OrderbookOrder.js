import React, {useState, useEffect, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Slider from 'rc-slider';
import { Tooltip } from 'reactstrap';
import {CustomInput} from '../../../../../../components';
const marks = {
  0: '',
  20: '',
  40: '',
  60: '',
  80: '',
  100: '',
};

const OrderbookOrder = () =>{
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const dispatch = useDispatch();
  const {symbol,userstatus, value, slidervalue, precision, step, maxlength, mode, isReduce, symbolPosition, walletBalance, mbc  } = useSelector(state => ({
    symbol: state.trade.symbol,
    userstatus: state.user.userstatus,
    value: state.trade.orderbook.value,
    slidervalue : state.trade.orderbook.sliderValue,
    precision : state.trade.orderbook.quantityPrecision,
    step: state.trade.exchangeInfo.minPrice,
    maxlength: state.trade.maxlength,
    mode: state.trade.orderbook.mode,
    isReduce: state.trade.orderbook.isReduce,
    symbolPosition: state.user.userBalance.symbolPosition,
    walletBalance: state.user.userBalance.walletBalance,
    mbc: state.user.mbc
  }))
  useEffect(()=>{
    return () => dispatch({type:'trade/CHANGE_ORDERBOOK_ORDER_VALUE', payload:{value:'', slider:''}})
  },[])

  const handleAmountChange = e => {
    if(userstatus=== 'cantrade'){
      const firstre = /^[0-9\b]+$/
      var check = e.target.value;
      const check3 = check.split('.');
      if(check.length ===0){
        dispatch({type:'trade/CHANGE_ORDERBOOK_ORDER_VALUE', payload:{value:check, slider:''}})
       
      }else if(check3.length ===2){
        let a =0;
        if(check3[0].length<=maxlength && (firstre.test(check3[0]) || check3[0] === '')){
          if(firstre.test(check3[0])){
            a = parseFloat(check3[0]);
          }
          if(firstre.test(check3[1]) || check3[1] === ''){
            if(check3[1].length>precision){
              dispatch({type:'trade/CHANGE_ORDERBOOK_ORDER_VALUE', payload:{value: a+'.'+check3[1].slice(0,3), slider:''}})
             
            }else{
              dispatch({type:'trade/CHANGE_ORDERBOOK_ORDER_VALUE', payload:{value: a+'.'+check3[1], slider:''}})
              
            }
          }
        }
      }else if(check3.length ===1){
        if(firstre.test(check3[0])){
          dispatch({type:'trade/CHANGE_ORDERBOOK_ORDER_VALUE', payload:{value: parseFloat(check3[0]), slider:""}})
          
        }
      }
    }
  };

  const handlePercent = value => {
    if(userstatus === 'cantrade'){
      if((isReduce && parseFloat(symbolPosition.positionAmt)!==0) || (!isReduce && parseFloat(walletBalance)>0)){
        dispatch({type:'trade/CHANGE_ORDERBOOK_ORDER_VALUE', payload:{value: value+"%", slider : value}})
    
      }
    }
  };

  const chagneIsReduce = () => {
   
    dispatch({type:'trade/CHANGE_ORDERBOOK_ORDER_ISREDUCE'})
    dispatch({type:'trade/CHANGE_ORDERBOOK_ORDER_VALUE', payload:{value:'', slider:''}})
   
  }

  const toggle = () => {
    setTooltipOpen(!tooltipOpen)
  }

  const sym = useMemo(() =>symbol.split("USDT"),[symbol])
  return (
    <>
    { mbc.mb ==='lg' || (mbc.mb==='md' && mbc.bookorderMode) ?
      <div className="flex">
      <div>
        <div className='inputdiv' style={{width:"90%"}}> 
          <input
            type='text'
            className='inputorderbook'
            step={step}
            min={step}
            value={value}
            onChange={handleAmountChange}
          />
          <span className='inputunit'>{sym[0]}</span>
        </div>
        <div>
          <Slider
            style={{ width: '85%', paddingTop: '10px' }}
            marks={marks}
            step={1}
            value={slidervalue}
            onChange={handlePercent}
            trackStyle={{backgroundColor:"#b3bdc9"}}
            railStyle={{backgroundColor:"#eaecef"}}
            dotStyle={{backgroundColor:"#eaecef", border:"1px solid", borderColor:"#fff"}}
            handleStyle={{border:"2px solid #b3bdc9", boxShadow:"none"}}
            activeDotStyle={{backgroundColor:"#b3bdc9", borderColor:"#fff"}}
          />
        </div>
      </div>
      {userstatus ==='cantrade' ? 
      <div className="robox">
        <div id="reduceOnlyTool">R.O</div>
        <Tooltip placement="top" isOpen={tooltipOpen} target="reduceOnlyTool" toggle={toggle}>
            Reduce Only
        </Tooltip>
        <CustomInput
        type='checkbox'
        id='ro'
        className ='reduce-check-input'
        checked ={isReduce}
        onChange ={chagneIsReduce}
        />
      </div>
      :<></>}
      
    </div>
    :<></>}
    </>
  );
}
export default OrderbookOrder;

