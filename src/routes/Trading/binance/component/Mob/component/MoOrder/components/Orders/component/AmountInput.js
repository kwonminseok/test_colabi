import React from 'react';


function AmountInput({symbol,amount,handleAmountChange}){

    const sym = symbol.split('USDT')

    return(
        <div style={{ margin: '10px',display:"flex" }} className='orderbookorder'>
            <div className="flex-1 mob-input-title"> Amount</div>
            <div style={{ width: '100%', flex:"1", marginRight:"4px" }} className='inputdiv '>
                <input
                    type='text'
                    className='inputorderbook '
                    value={amount}
                    onChange={handleAmountChange}
                />
                <div className='inputunit min45'>{sym[0]}</div>
            </div>
        </div>
    )
}

export default React.memo(AmountInput);