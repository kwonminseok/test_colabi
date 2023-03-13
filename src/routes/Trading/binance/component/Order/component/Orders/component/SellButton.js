import React from 'react';
import {Button} from 'reactstrap'

function SellButton({submitOrder,t}) {

    return (
        <Button className="flex-1 ordersellbtn" onClick={submitOrder}>
             {t('order.sell')}
        </Button>
    )
}

export default React.memo(SellButton)