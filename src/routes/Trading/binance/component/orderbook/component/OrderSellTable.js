import React, { useCallback, useMemo } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {List, AutoSizer} from 'react-virtualized'


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
           <span className='flex-1 text-right'>Price</span>
          <span className='flex-1 text-right'>Size</span>
          <span className={'flex-1 text-'+tti}>{ti}</span>
        </div>
      );
    }else {
      return <></>
    }
}

function setBuyPrice(aggtrade,unit,digit){
  if(aggtrade.length){
    if(!aggtrade[0].m){
      return (Math.floor(aggtrade[0].p / unit) * unit).toFixed(digit);
    }else return 0;
  }else return 0;
}



const OrderSellTable = () =>{
  const dispatch = useDispatch()
  const {asks,bigsum,digit,unit,aggtrade,symbol,orderbookMode,tradeType,sizedigit,mbc,userstatus,rowCount } = useSelector(state =>({
    asks: state.orderbook.asks,
    bigsum: state.orderbook.bigsum,
    digit: state.trade.orderbook.pricedigit,
    unit: state.trade.orderbook.unit,
    aggtrade: state.websocket.aggtrade.slice(0,1),
    symbol: state.trade.symbol,
    orderbookMode: state.trade.orderbook.mode,
    tradeType: state.trade.orderbook.tradeType,
    sizedigit: state.trade.orderbook.quantityPrecision,
    mbc: state.user.mbc,
    userstatus: state.user.userstatus,
    rowCount: state.trade.orderbook.rowCount
  }))

  const onClickTrading = useCallback( (price, type) => {
    if(userstatus === 'cantrade'){
      dispatch({type:'orderbook/SUMMIT_ORDERBOOK_ORDER', payload:{price: price,symbol: symbol,tradeType: type}})
      // this.props.summitOrderbookOrder({
      //   price: price,
      //   symbol: symbol,
      //   tradeType: type,
      // })
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

  const setItemCount = useCallback((height) => {
    if(height !== 0 && rowCount !== parseInt(height/22)){
      dispatch({type:'trade/SET_ORDERBOOK_ROWCOUNT', payload:parseInt(height/22)})
      //this.props.setOrderbookRowcount(parseInt(height/22))
    }
  },[rowCount])

  const a = useMemo(()=>setBuyPrice(aggtrade,unit,digit),[aggtrade,unit,digit])

  const rowRenderer = ({ index, style,key }) => {
   //dual Mode
      return (
        <div style={style}  key={key} className='flex'>
           <div className={"orderbook-cksdw "+mbc.mb+mbc.bookorderMode}>
              <div className={"flex-1 text-right "}>
                <div className='orderselldep' style={{width: (asks[index].sum * 95/3) / bigsum + '%' }}/>
                  <span
                   className={'prl ml-2p orderbookselltab'+ (a ===asks[index].price?'true':"")}
                   onClick={() => onClickGetPrice(asks[index].price)}
                   >
                    {asks[index].price}
                  </span>
                </div>
              <div className={"flex-1 text-right "} style={{ color: '#000' }}>{parseFloat(asks[index].amount).toFixed(sizedigit)}</div>
              {tradeType === 'off' ? (
                <div className='flex-1 text-right'>
                  {parseFloat(asks[index].sum).toFixed(sizedigit)}
                </div>
                ) : (
                  tradeType === 'buy'?
                  generateBuyRow(asks[index].price): generateSellRow(asks[index].price)
              )}
              </div>
        </div>
      );
   
  };

  const rowRendererSingle = ({ index, style,key, parent }) => {
      return (
        <div style={style}  key={key} className='flex'>
          <div className={"orderbook-cksdw "+mbc.mb+mbc.bookorderMode}>
          {generateBuyRow(asks[parent.props.rowCount-index-1].price)}
          <div className='flex-1 text-right' style={{ color: '#000' }}>
                  {parseFloat(asks[parent.props.rowCount-index-1].sum).toFixed(sizedigit)}
           </div>
          <div className={"flex-1 text-right"} style={{position:"relative"}}>
            <div className='singleselldep' style={{width: (asks[parent.props.rowCount-index-1].sum * 95) / bigsum + '%' }}/>
            <span 
            className={'prl ml-2p orderbookselltab'+ (a ===asks[parent.props.rowCount-index-1].price?'true':"")}
            onClick={() => onClickGetPrice(asks[parent.props.rowCount-index-1].price)}
            >
                  {asks[parent.props.rowCount-index-1].price}
            </span>
          </div>
          <div className='flex-1 text-right' style={{ color: '#000' }}>
            {parseFloat(asks[parent.props.rowCount-index-1].amount).toFixed(sizedigit)}
          </div>
          {generateSellRow(asks[parent.props.rowCount-index-1].price)}
          </div>
        </div>
      );
   
  };

  const rowRendererSingle2 = ({ index, style,key, parent }) => {
      return (
        <div style={style}  key={key} className='flex'>
            <div className={"orderbook-cksdw "+mbc.mb+mbc.bookorderMode}>
          <div className={"flex-1 text-left single2-price"}>
            <span 
            className={'prl ml-2p orderbookselltab'+ (a ===asks[parent.props.rowCount-index-1].price?'true':"")}
            onClick={() => onClickGetPrice(asks[parent.props.rowCount-index-1].price)}
            >
                  {asks[parent.props.rowCount-index-1].price}
            </span>
          </div>
          <div className='flex-1 text-right' style={{ color: '#000' }}>
            {parseFloat(asks[parent.props.rowCount-index-1].amount).toFixed(sizedigit)}
          </div>
          <div className='flex-1 text-right' style={{position:"relative"}}>
          <div className='singleselldep' style={{width: (asks[parent.props.rowCount-index-1].sum * 95) / bigsum + '%' }}/>
                 <span style={{ color: '#000' }}> {parseFloat(asks[parent.props.rowCount-index-1].sum).toFixed(sizedigit)} </span>
           </div>
          
          {generateBuyRow(asks[parent.props.rowCount-index-1].price)}
          {generateSellRow(asks[parent.props.rowCount-index-1].price)}
         
          </div>
        </div>
      );
   
  };

  const getRowCount = useCallback((height,rowH) => {
    if(parseInt(height/rowH)>asks.length){
      return asks.length
    }else{
      return parseInt(height/rowH);
    }
  },[asks])

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
      {asks.length && asks[0].sum !==undefined?
        <AutoSizer>
          {({height, width }) => {
            setItemCount(height,rowCount);
            const rowH = getRowHeight()
            return(
              orderbookMode === 'dual'? 
                <List
                rowCount={getRowCount(height,rowH)}
                width={width}
                height={height}
                rowHeight={rowH}
                data={asks}
                style={{overflowY: 'hidden'}}
                rowRenderer={rowRenderer}
                /> :
                orderbookMode === 'single1'?
                <List
                rowCount={getRowCount(height,rowH)}
                width={width}
                height={height}
                rowHeight={rowH}
                data={asks}
                style={{overflowY: 'hidden'}}
                rowRenderer={rowRendererSingle}
                />:
                <List
                 rowCount={getRowCount(height,rowH)}
                 width={width}
                 height={height}
                 rowHeight={rowH}
                 data={asks}
                 style={{overflowY: 'hidden'}}
                 rowRenderer={rowRendererSingle2}
                />
            )
          }
          }
        </AutoSizer>
        :<></>}
    </div>
    </>);

}

export default OrderSellTable;

