import React from 'react'
import { AiFillStar } from "react-icons/ai";


function Symbollist({symbol, list, handleClick}){
    const  a = list.indexOf(symbol+",")
    if(a ===-1){
        return (
            <div className="listsymbol">
               <div style={{paddingRight:"4px"}}>
                    <AiFillStar size={14} onClick={(e) => handleClick(e, symbol)}/>
                </div>
                <div className="list-symbol-title">
                {symbol}
                </div>
            </div>
        )
    }else{
        return(
            <div className="listsymbol">
                <div style={{paddingRight:"4px"}}>
                    <AiFillStar size={14} style={{color:"#58b589"}} onClick={(e) => handleClick(e, symbol)}/>
                </div>
                <div className="list-symbol-title">
                    {symbol}
                </div>
            </div>
        )
    }
}

export default React.memo(Symbollist)