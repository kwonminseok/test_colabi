import React from 'react';

function TrigerInput({handleTrigerChange, triger}) {

    return(
        <div style={{ marginTop: '20px' }} className='orderbookorder'>
                <div className='inputdiv '>
            <div className='inputname'>Stop Price</div>
                <input
                type='text'
                className='inputorderbook '
                value={triger}
                onChange={handleTrigerChange}
                />
            <div className='inputunit min45'>USDT</div>
            </div>
        </div>
    )
}

export default React.memo(TrigerInput);