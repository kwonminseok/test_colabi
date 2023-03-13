import React from 'react';

function InfoView({name,data}){

    return(
        <div className="mob-right-info">
            <div className="ttt">{name}</div>
            <div className="con">
                {parseFloat(data).toLocaleString()}
            </div>
        </div>
    )
}

export default  React.memo(InfoView);
