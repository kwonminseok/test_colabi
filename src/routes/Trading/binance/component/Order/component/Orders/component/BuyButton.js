import React from 'react';
import { Button } from 'reactstrap';


function BuyButton({submitOrder,t}){
    return (
        <Button className='flex-1 orderbuybtn' onClick={submitOrder}>
            {t('order.buy')}
        </Button>
    )
}

export default React.memo(BuyButton)