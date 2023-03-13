import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import OrderTable from './component/OrderTable';
import OrderbookView from './component/OrderbookView';
import { CardBody } from 'reactstrap';

function generateBuyRow(mbc){
  if(mbc.mb ==="lg" || (mbc.mb ==='md' && mbc.bookorderMode)){
    return (
      <span className='flex-1 text-center'>Buy</span>
    )
  }else{
    return <></>
  }
}

function generateSellRow (mbc) {
  if(mbc.mb ==="lg" || (mbc.mb ==='md' && mbc.bookorderMode)){
    return (
      <span className='flex-1 text-center'>Sell</span>
    )
  }else{
    return <></>
  }
}


const Orderbook = () => {
  const orderbookMode = useSelector(state => state.trade.orderbook.mode);
  const mbc = useSelector(state => state.user.mbc);
  const buyRow = useMemo(() =>generateBuyRow(mbc),[mbc])
  const sellRow = useMemo(()=> generateSellRow(mbc),[mbc])

  return (
      <CardBody className={orderbookMode+'bookpd futureoverfowdl2'}>
        <div className={orderbookMode+'orderbooktap'}>
          <div className={'flex '+orderbookMode+"orderbookborde"}>
            <OrderbookView />
          </div>
        </div>
        <div className={orderbookMode+'orderbook flex'}>
          {orderbookMode === 'single1'?
           <div className='flex recentCREIp orderbooktye recent-font'>
            {buyRow}
            <span className='flex-1 text-right '>Sum</span>
            <span className='flex-1 text-right '>Price</span>
            <span className='flex-1 text-right '>Size</span>
            {sellRow}
         </div>
         :orderbookMode ==='single2'?   
         <div className='flex recentCREIp orderbooktye recent-font'>
          <span className='flex-1 text-left single2-price-title'>Price</span>
          <span className='flex-1 text-right '>Size</span>
          <span className='flex-1 text-right '>Sum</span>
          {buyRow}
          {sellRow}
         </div> :<></>
         }
            <OrderTable />
        </div>
      </CardBody>
    // </Card>
  );
};

export default Orderbook;
