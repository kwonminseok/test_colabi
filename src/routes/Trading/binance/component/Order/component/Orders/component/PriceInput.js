import React from 'react';

function PriceInput({handlePriceChange, price, isMarket}) {

    return(
        <>
        {isMarket? 
        <></>:
        <div style={{ marginTop: '20px' }} className='orderbookorder'>
                <div className='inputdiv '>
            <div className='inputname'>Price</div>
                <input
                type='text'
                className='inputorderbook '
                value={price}
                onChange={handlePriceChange}
                />
            <div className='inputunit min45'>USDT</div>
            </div>
        </div>
        }
        </>
    )
}

export default React.memo(PriceInput);