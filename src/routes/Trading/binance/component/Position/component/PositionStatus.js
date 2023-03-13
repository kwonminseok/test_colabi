import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {List, AutoSizer} from 'react-virtualized'
import ClosePosition from './ClosePosition';
import './position.css'
import { NavLink as Link } from 'react-router-dom';
function calcPNL(position) {
   
  var roe = parseFloat((position.unRealizedPNL * 100) / position.positionMargin).toFixed(2);
 
  if (roe > 0) {
    return (
      <div className='position-litype05 tradebuy' style={{fontWeight:"600"}}>
        +{parseFloat(position.unRealizedPNL).toFixed(position.pricePrecision)}({roe}%)
      </div>
    );
  } else if (roe < 0) {
    return (
      <div className='position-litype05 tradesell' style={{fontWeight:"600"}}>
        {parseFloat(position.unRealizedPNL).toFixed(position.pricePrecision)}({roe}%)
      </div>
    );
  } else {
    return (
      <div className='position-litype05'>
        {parseFloat(position.unRealizedPNL).toFixed(position.pricePrecision)}({roe}%)
      </div>
    );
  }
};


const PositionStatus = (props) =>{
  const [positions, setPositions] = useState([])
  const userBalance= useSelector(state => state.user.userBalance)
  const {min, t, rowH} = props;
  useEffect(()=>{
    var arr = userBalance.positions.filter(item =>parseFloat(item.entryPrice)!==0)
    setPositions(arr)
  },[userBalance])
  const rowRenderer = ({ index, style,key }) => {
    const link = `/trade/binance/${positions[index].symbol}`
      return(
        <div style={style} key={key} className='positionlist'>
           <div className="position-li">
                <div className="position-lias38c">
                  <div className="position-livcnml20">
                {positions[index].positionAmt > 0 ? (
                <>
                <div className="positionsym" ></div>
                  <div className='position-litype01' >
                    <Link to={link} style={{cursor:"pointer"}}>
                      {positions[index].symbol}
                      <span className='spanlev'>{positions[index].leverage}x</span>
                      </Link> 
                  </div>
                  <div className='position-litype02 positionsize tradebuy'>
                    {positions[index].positionAmt}
                  </div>
                </>
              ) : (
                <>
                <div className="positionsymsell"></div>
                  <div className='position-litype01'>
                  <Link to={link} style={{cursor:"pointer"}}>
                    {positions[index].symbol}
                    <span className='spanlev'>{positions[index].leverage}x</span>
                    </Link> 
                  </div>
                  <div className='position-litype02 positionsize tradesell'>
                    {positions[index].positionAmt}
                  </div>
                </>
          )}
          <div className='position-litype02' style={{ fontWeight: '600' }}>
            {parseFloat(positions[index].entryPrice).toFixed(positions[index].pricePrecision)}
          </div>

          <div className='position-litype02'>
            {parseFloat(positions[index].markPrice).toFixed(positions[index].pricePrecision)}
          </div>

          <div className='position-litype02'>
            {parseFloat(positions[index].liquidationPrice) === 0 ? (
              '-'
              ) : 
              (
              <span className='tradesell'>
                {parseFloat(positions[index].liquidationPrice).toFixed(positions[index].pricePrecision)}
              </span>
            )}
          </div>
          <div className='position-litype03'>
            {positions[index].marginType ==="cross"? parseFloat(100*userBalance.crossMaintMargin/(userBalance.walletBalance - userBalance.isolatedMargin + userBalance.crossedUnPnl)).toFixed(2)+"%": 
            parseFloat(100*positions[index].maintMargin/(positions[index].isolatedMargin+positions[index].unRealizedPNL)).toFixed(2)+"%"
            }
          </div>
          
          <div className='position-litype04'>{parseFloat(positions[index].positionMargin).toFixed(positions[index].pricePrecision)}({positions[index].marginType})</div>
          {calcPNL(positions[index])}
          <div className='headtype03'>
                <ClosePosition
                  position ={positions[index]}
                />
              </div>
              </div>
              </div>
              </div>
        </div>
      )
    
  };

  return (
    <div className='poposisi'>
      <div className='position-header'>
        <div className='headtype11 '>{t('positions.symbol')}</div>
        <div className='headtype02'>{t('positions.position.size')}</div>
        <div className='headtype02'>{t('positions.position.entryprice')}</div>
        <div className='headtype02'>{t('positions.position.markprice')}</div>
        <div className='headtype02'>{t('positions.position.liqprice')}</div>
        <div className='headtype22'>{t('positions.position.marginratio')}</div>
        <div className='headtype04'>{t('positions.position.margin')}</div>
        <div className='headtype05'>{t('positions.position.pnl')}</div>
        <div className='headtype03'>{t('positions.position.closepostion')}</div>
      </div>
        <div className='positioncone'>
        <AutoSizer>
        {({height, width }) =>(
          <List
            rowCount={positions.length}
            width={Math.max(min,width)}
            height={height}
            rowHeight={rowH}
            data={positions}
            style={{overflowY:false}}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
        </div>
      </div>
  );

}

export default PositionStatus;


