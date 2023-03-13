import React from 'react';

function SymbolTitle({symbol}){
    return (
        <div className="future-symbolinfo">
           {symbol}
        </div>
    )
}

export default React.memo(SymbolTitle);