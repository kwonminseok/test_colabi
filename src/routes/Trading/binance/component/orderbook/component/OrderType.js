import React from 'react';
import {useSelector, useDispatch} from 'react-redux';


const OrderType = () =>{
  const dispatch = useDispatch()
  const {orderType, mbc} = useSelector(state =>({
    orderType: state.trade.orderbook.tradeType,
    mbc: state.user.mbc
  }))

  const onClickType = value => {
    dispatch({type:'trade/CHANGE_TRADE_TYPE', payload:value})
    
  };

  const generateDOM = () => {
    switch (orderType) {
      case 'off': {
        return (
          <>
            <div
              type='button'
              onClick={() => onClickType('buy')}
              className='flex-1 pad063'
            >
              Buy
            </div>
            <div
              type='button'
              onClick={() => onClickType('sell')}
              className='flex-1 pad063'
            >
              Sell
            </div>
            <div className='flex-1 ordertypeoff pad063'>Off</div>
          </>
        );
      }
      case 'buy': {
        return (
          <>
            <div className='flex-1 ordertypebuy pad063'>Buy</div>
            <div
              type='button'
              onClick={() => onClickType('sell')}
              className='flex-1 pad063'
            >
              Sell
            </div>
            <div
              type='button'
              onClick={() => onClickType('off')}
              className='flex-1 pad063'
            >
              Off
            </div>
          </>
        );
      }
      case 'sell': {
        return (
          <>
            <div
              type='button'
              onClick={() => onClickType('buy')}
              className='flex-1 pad063'
            >
              Buy
            </div>
            <div className='flex-1 ordertypesell'>Sell</div>
            <div
              type='button'
              onClick={() => onClickType('off')}
              className='flex-1 pad063'
            >
              Off
            </div>
          </>
        );
      }
      default: {
        return <></>;
      }
    }
  };

  return (
    <>
    { mbc.mb ==='lg' || (mbc.mb==='md' && mbc.bookorderMode) ?
      <>
        {generateDOM()}
      </>:
      <></>
    }
    </>
    );

}
export default OrderType;


