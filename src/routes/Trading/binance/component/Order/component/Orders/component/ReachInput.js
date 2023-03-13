import React from 'react';

function ReachInput({handleReachChange, reach}) {

    return(
        <div style={{ marginTop: '20px' }} className='orderbookorder'>
                <div className='inputdiv '>
            <div className='inputname'>Reach Price</div>
                <input
                type='text'
                className='inputorderbook '
                value={reach}
                onChange={handleReachChange}
                />
            <div className='inputunit min45'>USDT</div>
            </div>
        </div>
    )
}

export default React.memo(ReachInput);