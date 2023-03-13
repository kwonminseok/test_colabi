import React from 'react';
import OrderBuyTable from './OrderBuyTable';
import OrderSellTable from './OrderSellTable';
import { useSelector } from 'react-redux';
import OrderbookView from './OrderbookView';

const OrderTable = () => {
  const {orderbookMode, mbc} = useSelector(state =>({
    orderbookMode:  state.trade.orderbook.mode,
    mbc: state.user.mbc
  }))
  return (
    <div className={'flex ' + orderbookMode + 'orderBook'}>
      <div className={orderbookMode + 'flexs  recent-font'}>
        <OrderBuyTable />
      </div>
      {mbc.mb !== 'sm'? 
       <div className={orderbookMode+'ordervi'}>
        <OrderbookView />
        </div>:<></>
      }
     
      <div className={orderbookMode + 'flexs  recent-font'}>
        <OrderSellTable />
      </div>
    </div>
  );
};

export default OrderTable;
