import React from 'react';


function PriceInput({name,price,handleChange}){


    return(
        <div className='css-priceinput'>
            <div className="flex-1 mob-input-title"> {name}</div>
            <div style={{ width: '100%', flex:"1", marginRight:"4px" }} className='inputdiv '>
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

export default React.memo(PriceInput);