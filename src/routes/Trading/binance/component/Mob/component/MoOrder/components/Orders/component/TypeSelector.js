import React from 'react';
import classnames from 'classnames';

function TypeSelector({first,second,isActive, handleChange}){

    return(
        <div className="mob-place-order-box">
            <div 
                className={'mob-place-order '+  classnames({ active: isActive === false })}
                onClick={() =>handleChange(false)}
            > {first}</div>
            <div 
                className={'mob-place-order '+  classnames({ active: isActive === true })}
                onClick={() =>handleChange(true)}
            >{second}</div>
        </div>
    )
}

export default React.memo(TypeSelector)