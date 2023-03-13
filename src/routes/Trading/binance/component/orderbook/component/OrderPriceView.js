import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

function setAggTrade (aggtrade) {
  if(aggtrade.length){
    if (aggtrade[0].p > aggtrade[1].p) {
      return 'tradebuy'; //up
    } else if (aggtrade[0].p < aggtrade[1].p) {
      return 'tradesell'; //down
    } else {
      return ''; //stay
    }
  }
}


const OrderPriceView = () =>{
  const {pricedigit,mark,orderbookMode,propaggtrade} = useSelector(state => ({
    pricedigit: state.trade.exchangeInfo.pricePrecision,
    mark: state.websocket.symbolmark,
    orderbookMode: state.trade.orderbook.mode,
    propaggtrade: state.websocket.aggtrade.slice(0,2)
  }))

  const generateDOM = info => {
    switch (info) {
      case 'tradebuy': {
        return (
          <div
            className={orderbookMode + 'textagg flex-1 ' + info}
            style={{ fontWeight: '600' }}
          >
            {' '}
            {propaggtrade[0].p}
            <FaArrowUp />
          </div>
        );
      }
      case 'tradesell': {
        return (
          <div
            className={orderbookMode + 'textagg flex-1 ' + info}
            style={{ fontWeight: '600' }}
          >
            {' '}
            {propaggtrade[0].p}
            <FaArrowDown />
          </div>
        );
      }
      default: {
        return (
          <div
            className={orderbookMode + 'textagg flex-1 ' + info}
            style={{ fontWeight: '600' }}
          >
            {' '}
            {propaggtrade[0].p}
          </div>
        );
      }
    }
  };

  const info = useMemo(() =>setAggTrade(propaggtrade),[propaggtrade])
  return (
    <div className={orderbookMode+'flex orderpirce'}>
      {propaggtrade.length && mark ? (
        <>
          {generateDOM(info)}
          <div
            className={orderbookMode + 'text flex-1'}
          >
            {parseFloat(mark).toFixed(pricedigit)}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
export default OrderPriceView;