import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {List, AutoSizer} from 'react-virtualized'


function getTriger (item){
  if(item.Type ==="reach"){
    if(item.UpDown ==="down"){
      return 'last Price >= '+ item.ReachedPrice
    }else{
      return 'last Price <=' + item.ReachedPrice
    }
  }else {
    if(item.UpDown ==='mt'){
      return 'close Price >= '+ item.TriggerPrice
    }else if(item.UpDown ==='lt'){
      return 'close Price <= '+ item.TriggerPrice
    }
  }
}

function getStop(item){
  if(item.Type ==='reach'){
    return item.TriggerPrice
  }else{
    return '-'
  }
}

const Reserve = (props) =>{
  const {min, t} = props;
  const dispatch = useDispatch()
  const {reserve} = useSelector(state =>({
    reserve: state.user.reserve.reserveMargin
  }))

  const cancelReserveOrder = (item) => {
    const a = item.ClientId.substring(0,5);
    if(a === "reach"){
      dispatch({type:'api/CANCEL_REACH_ORDER', payload:{symbol:item.Symbol, clientId: item.ClientId, side:item.Side, type:'RESERVATION'}})
    }else if(a === 'close'){
      dispatch({type:'api/CANCEL_CLOSE_ORDER', payload:{symbol: item.Symbol, clientId: item.ClientId, side:item.Side, type:'KLINE'}})
    }
  }

  const cancelAllOrder = () =>{
    if(reserve.length){
      dispatch({type: 'api/CANCEL_ALL_RESERVE_ORDER'})
    }
  }

  const rowRenderer = ({index, style, key}) => {
    return (
      <div style={style} key={key} className="positionlist">
         <div className="position-li">
          <div className="position-lias38c">
            <div className="position-livcnml20">
              {reserve[index].Side === 'BUY'?
                  <>
                    <div className="positionsym" ></div>
                    <div className='position-litype02'>{reserve[index].Symbol}</div>
                    <div className='position-litype02 positionsize tradebuy textCenter'>
                      {reserve[index].Quantity}
                    </div>
                    <div className="position-litype02 textCenter">{reserve[index].Type}</div>
                  </>
                  :
                  <>
                    <div className="positionsymsell" ></div>
                    <div className='position-litype02'>{reserve[index].Symbol}</div>
                    <div className='position-litype02 positionsize tradesell textCenter'>
                      -{reserve[index].Quantity}
                    </div>
                    <div className="position-litype02 textCenter">{reserve[index].Type}</div>
                  </>  
                }
                  <div className="position-litype05 textCenter">{getTriger(reserve[index])}</div>
                  <div className="position-litype02 textCenter">{getStop(reserve[index])}</div>
                  <div className="position-litype02 textCenter">{reserve[index].OrderPrice}</div>
                  <div className="position-litype03 textCenter">{reserve[index].ReduceOnly? 'O':'X'}</div>
                  <div
                  type='button'
                   onClick={() => cancelReserveOrder(reserve[index])}
                  className='position-litype02 logoc textCenter'
                  >
                  {t('positions.stopreservation.cancel')}
                  </div>
            </div>
          </div>
         </div>
      </div>
    )
  
  }

  return(
      <div className="poposisi">
      <div className="reserve-header">
          <div className="headtype02">{t('positions.symbol')}</div>
          <div className="headtype02 textCenter">{t('positions.stopreservation.size')}</div>
          <div className="headtype02 textCenter">{t('positions.stopreservation.type')}</div>
          <div className="headtype05 textCenter">{t('positions.stopreservation.trigercondition')}</div>
          <div className="headtype02 textCenter">{t('positions.stopreservation.stopprice')}</div>
          <div className="headtype02 textCenter">{t('positions.stopreservation.orderprice')}</div>
          <div className='headtype22 textCenter'>{t('positions.stops.reduceonly')}</div>
          <div className="headtype02 logoc textCenter" onClick={() => cancelAllOrder()}>{t('positions.stops.cancelall')}</div>
      </div>
      <div className='positioncone'>
      <AutoSizer>
        {({height, width }) =>(
          <List
            rowCount={reserve.length}
            width={Math.max(min,width)}
            height={height}
            rowHeight={40}
            data={reserve}
            style={{overflowY:false}}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
      </div>
    </div>
  )
}
export default Reserve;


