import React, { useMemo } from 'react';
import { NavLink as Link } from 'react-router-dom';

function getLink(symbol){
    return `/trade/binance/${symbol}`
}

function LinkBox({symbolObject, symbol}){


    const generateDOM = (symbolObject)=> {
        return(
            <>
            {symbolObject.priceChangePercent>0? <div className="future-symper plusper">+{symbolObject.priceChangePercent}%</div>
            : symbolObject.priceChangePercent<0? <div className="future-symper minusper">{symbolObject.priceChangePercent}%</div>
            : <div className="future-symper">{symbolObject.priceChangePercent}%</div>}
            </>
        )
    }

    // const goLink = () =>{

    // }

    const link = useMemo(() =>getLink(symbolObject.symbol),[symbolObject.symbol])

    return(
       <Link to={link}   className={"funtrue-symbollink" + (symbol ===symbolObject.symbol ? " active":"")} >
                {/* <div className={"future-symboldiv" + (symbol ===symbolObject.symbol ? " active":"")}> */}
                    <div className="future-sym">{symbolObject.symbol}</div>
                    {generateDOM(symbolObject)}
                {/* </div> */}
        </Link>
    )
}

export default React.memo(LinkBox);