import React, {useEffect} from 'react';
import MobHeader from '../MobHeader';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { NavItem, Nav, NavLink } from 'reactstrap';
import Orders from './components/Orders/Orders'
import NotLog from '../NotLog';
const MoOrder =() => {
    const {active, userstatus, isOD, symbol} = useSelector(state =>({
        active: state.order.active,
        userstatus: state.user.userstatus,
        isOD:state.user.moblist.isOD,
        symbol: state.trade.symbol
    }))
    const dispatch = useDispatch();
    const { t } = useTranslation();

    // useEffect(()=>{
    //     dispatch({
    //         type:"order/CHANGE_PERCENT",
    //         payload:{
    //             amount:"",
    //             value:0
    //         }
    //     })

    //     dispatch({
    //         type:"order/CHANGE_ISMARKET",
    //         payload: false
    //     })

    // },[active,dispatch])

    const changeIsOD = () => {
        dispatch({
            type:"user/CHANGE_MOBLIST_ISOD",
            payload: !isOD
        })
    }

    const changeActive =(status) => {
        if(active !== status){
            if(symbol !=='BTCUSDT' && symbol !== 'LINKUSDT' && symbol !== 'ETHUSDT' && status === 'reservation'){

            }else{
                if(status !=='Limit'){
                    dispatch({type:"order/CHANGE_ISREDUCE",payload: true})
                }else{
                    dispatch({type:"order/CHANGE_ISREDUCE",payload: false})
                }
                dispatch({type:'order/CHANGE_ACTIVE', payload:status})
                dispatch({type:'order/CHANGE_ISMARKET', payload:false})
                dispatch({type:'order/CHANGE_PERCENT', payload:{value:'', amount:''}})
            }
        }
    }

    return(
        <div className="future-mob-container">
            <MobHeader
                name={t('order.sub')}
                isOpen={isOD}
                handleIsOpen={changeIsOD}
            />
            {isOD?
            <div className="screenall" style={{padding:"0.6rem 0.3rem", minHeight:"305px"}}>
            {userstatus ==='cantrade' || userstatus === 'cannottrade' ?
            <>
            <Nav tabs className='nav-justified'>
                <NavItem>
                    <NavLink
                    className={
                        classnames({ active: active === 'Limit' }) +
                        ' ordertab ' +
                        classnames({ active: active === 'Limit' })
                    }
                    style={{padding:"0.2rem"}}
                    onClick={()=>changeActive('Limit')}
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
                    style={{padding:"0.2rem"}}
                    onClick={()=>changeActive('stop')}
                    //tabId='stop' className=" ordertab "
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
                    style={{padding:"0.2rem"}}
                    onClick={() => changeActive('reservation')}
                    //tabId='reservation' className=" ordertab "
                    >
                    {t('order.reservation.title')}
                    </NavLink>
                </NavItem>
            </Nav>
            <div style={{marginTop:"10px"}}>
                {userstatus ==='cantrade'?
                
                <Orders/>:<NotLog/>}
            </div>
           
            </>
            :<NotLog/>}
        </div>
        :<></>}
        </div>
    )
}

export default MoOrder;
    
