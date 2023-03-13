import React from 'react';
import { useSelector } from 'react-redux';
import OrderPriceView from './OrderPriceView';
import OrderbookOrder from './OrderbookOrder';
import OrderType from './OrderType';

const OrderbookView = () => {
  const {orderbookMode,mbcsize} = useSelector(state =>({
    orderbookMode:state.trade.orderbook.mode,
    mbcsize:state.user.mbc
  }))
  
  return (
    <>
    {mbcsize.mb !== 'sm'?
    <div className='flex-1 unitdi flex'>
      {orderbookMode !=='dual' ?
      <>
      <div className={orderbookMode+'priceview'}>
        <OrderPriceView />
      </div>
        <div className={orderbookMode+'orderbookorder orderbookorder'}>
          <OrderbookOrder />
        </div>
      </>:
       <>
        <div className={orderbookMode+'orderbookorder orderbookorder'}>
          <OrderbookOrder />
        </div>
       <div className={orderbookMode+'priceview'}>
         <OrderPriceView />
       </div>
      <div
      className={orderbookMode+'ordertype'}
      style={{ fontSize: '0.8rem', color: '#000' }}
      >
      <div
       className={'orderbookorder '+orderbookMode+'view'}>
        <OrderType />
      </div>
    </div>
    </>
      }
    </div>
    :<></>}
    </>
  );
};

export default OrderbookView;
