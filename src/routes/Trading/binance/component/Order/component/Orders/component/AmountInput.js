import React from 'react';

function AmountInput({handleAmountChange, amount, symbol}) {

    const sym = symbol.split('USDT')
    return(
        <div style={{ marginTop: '20px' }} className='orderbookorder'>
                <div className='inputdiv '>
                <div className='inputname'>Amount</div>
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