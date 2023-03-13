import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import Linkfutures from './component/Linkfutures';
import SymbolInfos from './component/SymbolInfos';
import AggtradePrice from './component/AggtradePrice';
import UserWallet from './component/UserWallet'
import MarginModeButton from './component/MarginModeButton';
import LeverageButton from './component/LeverageButton'
import SymbolSelector from './component/SymbolSelector/SymbolSelector'
let openId = false;
 
const Subheader = () =>{
  
  const {symbol, openInterest, rate, fundingTime, userstatus, position, openorder,mb } = useSelector(state =>({
    symbol: state.trade.symbol,
    openInterest: state.api.openInterest,
    rate: state.websocket.rate,
    fundingTime: state.websocket.fundingTime,
    userstatus: state.user.userstatus,
    position: state.user.userTraInfo.nowPosition,
    openorder: state.user.userTraInfo.nowOpenOrder,
    mb: state.user.mbc.mb
  }))
  const dispatch = useDispatch();

  useEffect(()=>{
    return () =>{
      clearInterval(openId);
      openId = false;
    }
  },[])

  useEffect(() =>{
    // setSymbol(symbol)
    dispatch({type:'api/GET_OPENINTEREST',payload:symbol})
    clearOpenInterest();
    openId = setInterval(
      () => dispatch({type:'api/GET_OPENINTEREST',payload:symbol}),
      60000,
    );
  },[symbol])

  const clearOpenInterest = () => {
    if (openId) {
      clearInterval(openId);
    }
    openId = false;
  };

  return(
    <>
      <Linkfutures
        symbol={symbol}
      />   
    <div style={{margin:"0px", minWidth:"0px"}}>
    <div className="future-symbol">
        <div className="future-symbolcon">
            <SymbolSelector
              symbol ={symbol}
            />
            <div className="future-btn-mof">
              <MarginModeButton
                symbol ={symbol}
                userstatus={userstatus}
                position={position}
                openorder={openorder}
               />
               <LeverageButton
               symbol ={symbol}
               userstatus={userstatus}
               position={position}
               />
            </div>
            <AggtradePrice
              symbol={symbol}
              classes= "future-sub-price "
            />
            <SymbolInfos
              symbol={symbol}
              fundingTime={fundingTime}
              openInterest={openInterest}
              rate={rate}
            />
            <UserWallet
            userstatus={userstatus}
            mb={mb}
            />
        </div>
    </div>
    </div>
  </>
  )
}
export default Subheader;