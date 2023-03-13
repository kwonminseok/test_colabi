import React from 'react';


function CostView({cost,t}) {
    return (
        <>
        <div>
            {t('order.cost')}:
        </div>
        <div className="amountfit">
            {parseFloat(cost).toFixed(2)} USDT
        </div>
        </>
        // <span className={classes}>
        //         비용: {parseFloat(cost).toFixed(2)} USDT
        // </span>
    )
}

export default React.memo(CostView)