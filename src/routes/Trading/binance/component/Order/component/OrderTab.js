import React from 'react';
import { NavItem, Nav, NavLink  } from 'reactstrap';
import classnames from 'classnames';
import SyncLoader from "react-spinners/SyncLoader";
import LimitOrder from './Orders/LimitOrder';
import { useSelector, useDispatch } from 'react-redux';

const OrderTab = (props) =>{
  const {userstatus, t} = props;
  const active = useSelector(state => state.order.active)
  const symbol = useSelector(state => state.trade.symbol)
  const dispatch = useDispatch();

  const onClickChangeActive = status => {
    
    if(active !== status){
      if(symbol !=='BTCUSDT' && symbol !== 'LINKUSDT' && symbol !== 'ETHUSDT' && status === 'reservation'){

      }else{
        if(status !=='Limit'){
          dispatch({type:'order/CHANGE_ISREDUCE', payload:true})
        }else{
          dispatch({type:'order/CHANGE_ISREDUCE', payload:false})
        }
        dispatch({type:'order/CHANGE_ACTIVE', payload:status})
        dispatch({type:'order/CHANGE_ISMARKET', payload:false})
        dispatch({type:'order/CHANGE_PERCENT', payload:{value:'', amount:''}})
      }
    }
  }

  return (
    <>
      <Nav tabs className='nav-justified'>
        <NavItem>
          <NavLink
            className={
              classnames({ active: active === 'Limit' }) +
              ' draggableCancel ordertab ' +
              classnames({ active: active === 'Limit' })
            }
            onClick={() => onClickChangeActive('Limit')}
          >
            {t('order.limit.title')}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={
              classnames({ active: active === 'stop' }) +
              ' draggableCancel ordertab ' +
              classnames({ active: active === 'stop' })
            }
            onClick={() => onClickChangeActive('stop')}
          >
            {t('order.stop.title')}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={
              classnames({ active: active === 'reservation' }) +
              ' draggableCancel ordertab ' +
              classnames({ active: active === 'reservation' })
            }
            onClick={() => onClickChangeActive('reservation')}
            //tabId='reservation' className=" ordertab "
          >
            {t('order.reservation.title')}
          </NavLink>
        </NavItem>
      </Nav>
      {userstatus !== 'none' ?
        <div  style={{ marginTop: '20px' }}>
          <LimitOrder 
          />
        </div>
      :
      <div className="order-sync">
        <SyncLoader size={10}
          color="#58b589"
          margin="2px" />
      </div>
      }
    </>
  );

}
export default OrderTab;

