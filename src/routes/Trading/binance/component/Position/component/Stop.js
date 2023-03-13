import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {List, AutoSizer} from 'react-virtualized'


function setStopPrice (item) {
  switch (item.type) {
    case 'STOP': {
      return (
        <>
          <div className='position-litype02 textCenter'>{item.price}</div>
          <div className='position-litype00 textCenter'>{item.workingType==="MARK_PRICE"? "Mark Price":"Last Price"}</div>
          <div className='position-litype02 textCenter'>{item.stopPrice}</div>
        </>
      );
    }
    case 'STOP_MARKET': {
      return (
        <>
          <div className='position-litype02 textCenter'>Market</div>
          <div className='position-litype00 textCenter'>{item.workingType==="MARK_PRICE"? "Mark Price":"Last Price"}</div>
          <div className='position-litype02 textCenter'>{item.stopPrice}</div>
        </>
      );
    }
    case 'TAKE_PROFIT': {
      return (
        <>
          <div className='position-litype02 textCenter'>{item.price}</div>
          <div className='position-litype00 textCenter'>{item.workingType==="MARK_PRICE"? "Mark Price":"Last Price"}</div>
          <div className='position-litype02 textCenter'>{item.stopPrice}</div>
        </>
      );
    }
    case 'TAKE_PROFIT_MARKET': {
      return (
        <>
          <div className='position-litype02 textCenter'>Market</div>
          <div className='position-litype00 textCenter'>{item.workingType==="MARK_PRICE"? "Mark Price":"Last Price"}</div>
          <div className='position-litype02 textCenter'>{item.stopPrice}</div>
        </>
      );
    }
    case 'TRAILING_STOP_MARKET': {
      return (
        <>
          <div className='position-litype02 textCenter'>C.R = {item.priceRate}%</div>
          <div className='position-litype00 textCenter'>Activation Price</div>
          <div className='position-litype02 textCenter'>{item.activatePrice}</div>
        </>
      );
    }
    default:
      return;
  }
};

const Stop = (props) =>{
  const {min, t} = props;
  const dispatch = useDispatch();
  const stopOrder = useSelector(state => state.user.userTraInfo.stopOrder)


  const rowRenderer = ({index, style, key}) => {
    return(
      <div style={style} key={key} className="positionlist">
        <div className="position-li">
          <div className="position-lias38c">
            <div className="position-livcnml20">
              {stopOrder[index].side === 'BUY'?
              <>
                <div className="positionsym" ></div>
                <div className='position-litype00'>{stopOrder[index].symbol}</div>
                <div className='position-litype00 positionsize tradebuy textCenter'>
                    {stopOrder[index].closePosition? "Close Position":stopOrder[index].origQty}
                </div>
              </>
              :
              <>
                <div className="positionsymsell" ></div>
                <div className='position-litype00'>{stopOrder[index].symbol}</div>
                <div className='position-litype00 positionsize tradesell textCenter'>
                    {stopOrder[index].closePosition? "Close Position": -stopOrder[index].origQty}
                </div>
              </>  
              }
               {setStopPrice(stopOrder[index])}
              <div className='position-litype03 textCenter'>
                {stopOrder[index].reduceOnly ? 'O' : 'X'}
              </div>
              <div
                type='button'
                onClick={() =>dispatch({type:'api/CANCEL_ORDER', payload:stopOrder[index]})}
                className='position-litype02 logoc textCenter'
              >
               {t('positions.activeorder.cancel')}
              </div>
            </div>
          </div>
        </div>    
      </div>
    )
  }

  return (
    <div className='poposisi'>
      <div className='stop-header'>
        <div className='headtype00'>{t('positions.symbol')}</div>
        <div className='textCenter headtype00'>{t('positions.stops.qty')}</div>
        <div className='headtype02 textCenter'>{t('positions.stops.orderprice')}</div>
        <div className='headtype00 textCenter'>{t('positions.stops.triggerbasis')}</div>
        <div className='headtype02 textCenter'>{t('positions.stops.triggerprice')}</div>
        <div className='headtype22 textCenter'>{t('positions.stops.reduceonly')}</div>
        <div className='headtype02 textCenter'>{t('positions.stopreservation.cancel')}</div>
      </div>
      <div className='positioncone'>
      <AutoSizer>
        {({height, width }) =>(
          <List
            rowCount={stopOrder.length}
            width={Math.max(min,width)}
            height={height}
            rowHeight={40}
            data={stopOrder}
            style={{overflowY:false}}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
       
      </div>
     
    </div>
  );

}

export default Stop;