import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Linkfutures from '../../../Subheader/component/Linkfutures';
import AggtradePrice from '../../../Subheader/component/AggtradePrice';
import SymbolInfo from './components/SymbolInfo'
import MarginModeButton from '../../../Subheader/component/MarginModeButton'
import LeverageButton from '../../../Subheader/component/LeverageButton'
import SymbolSelector from '../../../Subheader/component/SymbolSelector/SymbolSelector'
let openId = false;
const Subtitle = () =>{
  const {symbol, openInterest, rate, fundingTime, userstatus, position, openorder,mark,pricedigit } = useSelector(state =>({
    symbol: state.trade.symbol,
    openInterest: state.api.openInterest,
    rate: state.websocket.rate,
    fundingTime: state.websocket.fundingTime,
    userstatus: state.user.userstatus,
    position: state.user.userTraInfo.nowPosition,
    openorder: state.user.userTraInfo.nowOpenOrder,
    mark: state.websocket.symbolmark,
    pricedigit: state.trade.exchangeInfo.pricePrecision,
  }))
  const dispatch = useDispatch();
  
  useEffect(()=>{
    return () =>{
      clearInterval(openId);
      openId = false;
    }
  },[])

  useEffect(() =>{
    // setNsymbol(symbol)
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

  return (
    <div className="mob-subheader">
        <div className="future-togo">
            <div className="future-sclk6">
                <div className="future-symbollist">
                    <Linkfutures
                        symbol={symbol}
                    />
                </div>
            </div>
        </div>
        <div className="mob-subsymbol"> 
            <div className="mob-subleft">
                <div className="mob-symbolinfo">
                  <SymbolSelector
                  symbol={symbol}/>
                    {/* <div className="mob-sym">{symbol}</div> */}
                </div>
                <div className="mob-agg-pr">
                    <AggtradePrice
                        symbol={symbol}
                        classes="mob-sym "
                    />
                </div>
                <div className="mob-mark">{mark? parseFloat(mark).toFixed(pricedigit):""}</div>
                <div>
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
            </div>
            <div className="mob-subright">
                <SymbolInfo
                    symbol={symbol}
                    fundingTime={fundingTime}
                    rate={rate}
                    openInterest={openInterest}
                />
            </div>
        </div>
    </div>
  )
}
export default Subtitle;