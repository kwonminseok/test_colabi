import React from 'react';


function AmountView({amount, symbol,side}) {
     const sym = symbol.split('USDT')
    return (
        <>
        <div>
            {side}:
        </div>
        <div className="amountfit">
            {amount} {sym[0]}
        </div>
        </>
    )
}

export default React.memo(AmountView)