import React from 'react'

function WalletRow ({title,num}){


    return (
        <div className="margin-info">
            <div className="ttt">{title}</div>
            <div className="con">{parseFloat(num).toFixed(2)} USDT</div> 
        </div>
    )
}

export default React.memo(WalletRow)