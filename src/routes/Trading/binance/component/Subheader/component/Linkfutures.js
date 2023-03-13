import React from 'react';
import { useSelector } from 'react-redux';
import LinkScroll from './LinkScroll';
function Linkfutures({symbol}) {
    
    const {activeData,status} = useSelector(state =>({
        activeData: state.websocket.activefutures,
        status: state.user.status,
    }))
    
    
    return (
        <>
        {activeData.length&& status?
            <div className="future-togo">
                    <LinkScroll
                    activeData={activeData}
                    symbol={symbol}/>
            </div>
        :<></>}
        </>
    )

}

export default React.memo(Linkfutures);