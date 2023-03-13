import React from 'react';
import Countdown,{ zeroPad } from 'react-countdown';
import { useSelector } from 'react-redux';
import InfoView from './InfoView'
import InfoViews from './InfoViews'
function SymbolInfo({fundingTime,rate,openInterest,symbol}){
    const symbolfuture = useSelector(state => state.websocket.symbolfuture)
    const sym = (symbol.split("USDT"))[0];
    const renderer = ({ hours, minutes, seconds }) => {
        return <span>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>
    };


    return(
    <>    
        <div className="mob-right-info">
            <div className="ttt">Funding / Countdown</div>
            <div className="con">
                <div className={"future-con-fee "+(rate>0? "tradesell": 'tradebuy')}>
                    {parseFloat(rate * 100).toFixed(4)}%
                </div>
                <div style={{display:"inline-block"}}>
                {fundingTime !==0? 
                    <Countdown
                        date={fundingTime}
                        renderer={renderer}
                        overtime={true}
                    />:
                    <></>
                }
                </div>
            </div>
        </div>
        <InfoViews
        name='24h High/Low'
        high={symbolfuture.h}
        low={symbolfuture.l}
        />
        <InfoView
        name={'24h Volume ('+sym[0]+')'}
        data={symbolfuture.v}
        />
        <InfoView
        name={'Open Interest ('+sym[0]+')'}
        data={openInterest}
        />
    </>    
    )
}

export default React.memo(SymbolInfo);
