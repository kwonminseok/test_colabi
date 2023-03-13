import React from 'react';

function InfoViews({name,high,low}){

    return(
        <div className="mob-right-info">
            <div className="ttt">{name}</div>
            <div className="con">
                {parseFloat(high).toLocaleString()}/{parseFloat(low).toLocaleString()}
            </div>
        </div>
    )
}

export default  React.memo(InfoViews);
