import React,{useEffect} from 'react';
import Countdown,{ zeroPad } from 'react-countdown';
import { useSelector } from 'react-redux';
import InfoView from './InfoView'
function SymbolInfos ({symbol,fundingTime,rate,openInterest}){

    const sym = (symbol.split("USDT"))[0];
    const symbolfuture = useSelector(state => state.websocket.symbolfuture)
    useEffect(()=>{
      if(symbolfuture.lastPrice !== undefined){
        document.title = `${symbolfuture.lastPrice} | ${symbol} | Bitcolabi`;
      }
    },[symbolfuture.lastPrice,symbol])

    const renderer = ({ hours, minutes, seconds }) => {
      return <span>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>
    };
    return(
        <>
                   <div className="future-funding">
                      <div className="ttt">
                        <div className="future-fundingtime">Funding / Countdown</div>
                      </div>
                      <div className="con">
                        <div className={"future-con-fee "+(rate>0? "tradesell": 'tradebuy')}>{parseFloat(rate * 100).toFixed(4)}%</div>
                        <div className="future-con-fee">
                          {fundingTime !==0? 
                          <Countdown
                            date={fundingTime}
                            renderer={renderer}
                            overtime={true}
                            />:<></>}
                        </div>
                      </div>
                    </div>
                      <InfoView
                        name='24h High'
                        data={symbolfuture.h}
                      />
                      <InfoView
                        name='24h Low'
                        data={symbolfuture.l}
                      />
                      <InfoView
                        name={'24h Volume ('+sym+')'}
                        data={symbolfuture.v}
                      />
                      <InfoView
                        name={'Open Interest ('+sym+')'}
                        data={openInterest}
                      />
        </>
    )
}

export default React.memo(SymbolInfos);