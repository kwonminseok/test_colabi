import React, { useCallback, useMemo } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { List, AutoSizer} from 'react-virtualized'

function newTitle (tradeType,orderbookMode) {
  let ti = 'Trading';
  let tti = 'center'
  if (tradeType === 'off') {
    ti = 'Sum';
    tti = 'right'
  }

if (orderbookMode === 'dual') {
    return (
      <div className='flex recentCREIp orderbooktye'>
        <span className={'flex-1 text-'+tti}>{ti}</span>
        <span className='flex-1 text-right '>Size</span>
        <span className='flex-1 text-right '>Price</span>
      </div>
    );
  }else{
    return <></>
  }
}

function setSellPrice(aggtrade,unit,digit){
  if(aggtrade.length){
    if(aggtrade[0].m){
      return (Math.floor(aggtrade[0].p / unit) * unit).toFixed(digit);
    }else return 0;
  }else return 0;
}


const OrderBuyTable = () =>{
  const dispatch = useDispatch()
  const {bids,bigsum,digit,unit,aggtrade,symbol,orderbookMode,tradeType,sizedigit,mbc,userstatus } = useSelector(state =>({
    bids: state.orderbook.bids,
    bigsum: state.orderbook.bigsum,
    digit: state.trade.orderbook.pricedigit,
    unit: state.trade.orderbook.unit,
    aggtrade: state.websocket.aggtrade.slice(0,1),
    symbol: state.trade.symbol,
    orderbookMode: state.trade.orderbook.mode,
    tradeType: state.trade.orderbook.tradeType,
    sizedigit: state.trade.orderbook.quantityPrecision,
    mbc: state.user.mbc,
    userstatus: state.user.userstatus
  }))

  const onClickTrading = useCallback( (price, type) => {
    if(userstatus === 'cantrade'){
      dispatch({type:'orderbook/SUMMIT_ORDERBOOK_ORDER', payload:{price: price,symbol: symbol,tradeType: type,}})
    }
  },[userstatus,symbol])


    const onClickGetPrice = useCallback(price => {
      dispatch({type:'order/SET_PRICE', payload:price})
    },[])


    

  const generateBuyRow = useCallback((price) => {
    if(mbc.mb ==="lg" || (mbc.mb ==='md' && mbc.bookorderMode)){
      return (
        <div className="flex-1 " style={{width:"100%", textAlign:"center"}}>
          <div
          type='button'
          onClick={() => onClickTrading(price,'buy')}
          className={'buytraading2 '+mbc.mb+mbc.bookorderMode+"btn"}
          >
          Buy
          </div>
        </div>
      )
    }else{
      return <></>
    }
  },[mbc,onClickTrading])
  
  const generateSellRow = useCallback((price) => {
    if( mbc.mb ==="lg" || (mbc.mb ==='md' && mbc.bookorderMode)){
      return (
        <div className="flex-1 " style={{width:"100%", textAlign:"center"}}>
          <div
            type='button'
            onClick={() => onClickTrading(price,'sell')}
            className={"selltraading2 "+mbc.mb+mbc.bookorderMode+"btn"}
          >
          Sell
          </div>
        </div>  
      )
    }else{
      return <></>
    }
  },[mbc,onClickTrading])
  
  
   const a = useMemo(()=>setSellPrice(aggtrade,unit,digit),[aggtrade,unit,digit])
   const rowRenderer = ({ index, style,key }) => {
      return (
        <div style={style}  key={key} className='flex'>
            <div className={"orderbook-cksdw "+mbc.mb+mbc.bookorderMode}>
               {tradeType === 'off' ? (
                      <div className='flex-1 text-right'>
                         {parseFloat(bids[index].sum).toFixed(sizedigit)}
                      </div>
                    ) : (
                      tradeType === 'buy'?
                      generateBuyRow(bids[index].price): generateSellRow(bids[index].price)
                    )}
                <div className="flex-1 text-right " style={{ color: '#000' }}>{parseFloat(bids[index].amount).toFixed(sizedigit)}</div>          
                <div className="flex-1 text-right ">
                <div className='orderbuydep' style={{width: (bids[index].sum * 95/3) / bigsum + '%' }}/>
                  <span 
                  className={'prl ml-2p singlebookbuytab'+ (a ===bids[index].price?'true':"")}
                  onClick={() => onClickGetPrice(bids[index].price)}
                  >
                    {bids[index].price}
                  </span>
                </div>
                </div>
        </div>
      );
    };
  
   const rowRendererSingle = ({ index, style,key }) => {
        return (
          <div style={style}  key={key} className='flex'>
            <div className={"orderbook-cksdw "+mbc.mb+mbc.bookorderMode}>
            {generateBuyRow(bids[index].price)}
            <div className='flex-1 text-right' style={{ color: '#000' }}>
                    {parseFloat(bids[index].sum).toFixed(sizedigit)}
             </div>
            <div className={"flex-1 text-right"} style={{position:"relative"}}>
              <div className='singlebuydep' style={{width: (bids[index].sum * 95) / bigsum + '%' }}/>
              <span  
              className={'prl ml-2p singlebookbuytab'+ (a ===bids[index].price?'true':"")}
              onClick={() => onClickGetPrice(bids[index].price)}
              >
                    {bids[index].price}
              </span>
            </div>
            <div className='flex-1 text-right' style={{ color: '#000' }}>
              {parseFloat(bids[index].amount).toFixed(sizedigit)}
            </div>
            {generateSellRow(bids[index].price)}
            </div>    
          </div>
        );
    };
  
    const rowRendererSingle2 = ({ index, style,key,  }) => {
      
        return (
          <div style={style}  key={key} className='flex'>
             <div className={"orderbook-cksdw "+mbc.mb+mbc.bookorderMode}>
            <div className={"flex-1 text-left single2-price"} >
              <span 
              className={'prl ml-2p singlebookbuytab'+ (a ===bids[index].price?'true':"")}
              onClick={() => onClickGetPrice(bids[index].price)}
              >
                    {bids[index].price}
              </span>
            </div>
            <div className='flex-1 text-right' style={{ color: '#000' }}>
              {parseFloat(bids[index].amount).toFixed(sizedigit)}
            </div>
            <div className='flex-1 text-right' style={{position:"relative"}}>
              <div className='singlebuydep' style={{width: (bids[index].sum * 95) / bigsum + '%' }}/>
              <span style={{ color: '#000' }}>
                    {parseFloat(bids[index].sum).toFixed(sizedigit)}
              </span>
             </div>
             {generateBuyRow(bids[index].price)}
             {generateSellRow(bids[index].price)} 
            </div>
                
          </div>
        );
    };

    const getRowCount = useCallback((height,rowH) => {
      if(parseInt(height/rowH)>bids.length){
        return bids.length
      }else{
        return parseInt(height/rowH);
      }
    },[bids])

    const getRowHeight = useCallback(() => {
      if(mbc.mb ==='md' && mbc.bookorderMode){
        return 27;
      }else if(mbc.mb === 'md'){
        return 21
      }else {
        return 22
      }
    },[mbc])

    const title = useMemo(()=>newTitle(tradeType,orderbookMode),[tradeType,orderbookMode])

    return (
      <>
        {title}
        <div className={'recenttradeocn'+orderbookMode}>
        {bids.length && bids[0].sum !== undefined ?
          <AutoSizer>
            {({height, width }) => {
               const rowH = getRowHeight()
              return(
                orderbookMode ==='dual'?
                <List
                rowCount={getRowCount(height,rowH)}
                width={width}
                height={height}
                rowHeight={rowH}
                data={bids}
                style={{overflowY: 'hidden'}}
                rowRenderer={rowRenderer}
                //overscanRowCount={3}
              />
              :
                orderbookMode ==='single1'?
                <List
                rowCount={getRowCount(height,rowH)}
                width={width}
                height={height}
                rowHeight={rowH}
                data={bids}
                style={{overflowY: 'hidden'}}
                rowRenderer={rowRendererSingle}
                //overscanRowCount={3}
              />
              :
              <List
                rowCount={getRowCount(height,rowH)}
                width={width}
                height={height}
                rowHeight={rowH}
                data={bids}
                style={{overflowY: 'hidden'}}
                rowRenderer={rowRendererSingle2}
                //overscanRowCount={3}
              />
              )
            }
            }
          </AutoSizer>
        :<></>}
        </div>
      </>
    );

}
export default OrderBuyTable;