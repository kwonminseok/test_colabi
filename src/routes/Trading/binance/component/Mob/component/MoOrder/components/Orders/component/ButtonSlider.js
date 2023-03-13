import React from 'react';


function ButtonSlider({percent,handleClick}){


    return(
        <span className="mob-percent" onClick={handleClick}>{percent}%</span>
    )
}


export default React.memo(ButtonSlider);
