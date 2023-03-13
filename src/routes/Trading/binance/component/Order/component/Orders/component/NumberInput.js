import React from 'react';

function NumberInput({name, price, handleChange}) {

    return(
        <div className='css-priceinput'>
            <div className='inputdiv '>
            <div className='inputname'>{name}</div>
                <input
                type='text'
                className='inputorderbook '
                value={price}
                onChange={handleChange}
                />
            <div className='inputunit min45'>USDT</div>
            </div>
        </div>
    )
}

export default React.memo(NumberInput);