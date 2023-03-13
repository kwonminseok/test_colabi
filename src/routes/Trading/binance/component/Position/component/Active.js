import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {List, AutoSizer} from 'react-virtualized'



const Active = (props) =>{
  const activeOrder = useSelector(state => state.user.userTraInfo.activeOrder)
  const dispatch= useDispatch();
  const {t, min} = props;

  const rowRenderer = ({index, style, key}) => {
    return(
      <div style={style} key={key} className="positionlist">
        <div className="position-li">
          <div className="position-lias38c">
            <div className="position-livcnml20">
              {activeOrder[index].side === 'BUY'?
              <>
                <div className="positionsym" ></div>
                <div className='position-litype00'>{activeOrder[index].symbol}</div>
                <div className='position-litype02 positionsize tradebuy textCenter'>
                    {activeOrder[index].origQty}
                </div>
              </>
              :
              <>
                <div className="positionsymsell" ></div>
                <div className='position-litype00'>{activeOrder[index].symbol}</div>
                <div className='position-litype02 positionsize tradesell textCenter'>
                    -{activeOrder[index].origQty}
                </div>
              </>  
              }
              <div className='position-litype02 textCenter'>{activeOrder[index].price}</div>
              <div className='position-litype02 textCenter'>{activeOrder[index].executedQty}</div>
              <div className='position-litype02 textCenter'>{parseFloat(activeOrder[index].origQty-activeOrder[index].executedQty)}</div>
              <div className='position-litype03 textCenter'>
                {activeOrder[index].reduceOnly ? 'O' : 'X'}
              </div>
              <div
                type='button'
                onClick={() => dispatch({type:'api/CANCEL_ORDER', payload:activeOrder[index]})}
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
      <div className='active-header'>
        <div className='headtype00'>{t('positions.symbol')}</div>
        <div className='headtype02 textCenter'>{t('positions.activeorder.qty')}</div>
        <div className='headtype02 textCenter'>{t('positions.activeorder.orderprice')}</div>
        <div className='headtype02 textCenter'>{t('positions.activeorder.filled')}</div>
        <div className='headtype02 textCenter'>{t('positions.activeorder.remaining')}</div>
        <div className='headtype22 textCenter'>{t('positions.activeorder.reduceonly')}</div>
        <div className='headtype02 textCenter'>{t('positions.stopreservation.cancel')}</div>
      </div>
    
        <div className='positioncone'>
        <AutoSizer>
        {({height, width }) =>(
          <List
            rowCount={activeOrder.length}
            width={Math.max(min,width)}
            height={height}
            rowHeight={40}
            data={activeOrder}
            style={{overflowY:false}}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
        </div>
    </div>
  );
}

export default Active;


