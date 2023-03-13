import React from 'react'
import { useSelector } from 'react-redux';
function AggtradePrice ({symbol, classes}){
    const aggtrade = useSelector(state => state.websocket.aggtrade.slice(0,2))

    const setAggTrade = () => {
        if (aggtrade.length) {
          if (aggtrade[0].p > aggtrade[1].p) {
            return 'tradebuy'; //up
          } else if (aggtrade[0].p <aggtrade[1].p) {
            return 'tradesell'; //down
          } else {
            return ''; 
          }
        }
    };
    const a = setAggTrade()
    
    return(
            <div className={classes+a} >
                {aggtrade.length?  aggtrade[0].p:''}
            </div> 
    )
}
export default React.memo(AggtradePrice);