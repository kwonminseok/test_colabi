import React, {useState} from 'react';
import { NavItem, TabPane, Nav, NavLink, TabContent } from 'reactstrap';
import classnames from 'classnames';
import PositionStatus from '../../Position/component/PositionStatus'
import Active from '../../Position/component/Active';
import Stop from '../../Position/component/Stop';
import Reserve from '../../Position/component/Reserve'
import { BsArrowsAngleContract,BsArrowsAngleExpand } from "react-icons/bs";
import NotLog from './NotLog';
import {useSelector, useDispatch} from 'react-redux';
import { useTranslation } from 'react-i18next';
const Mob = () =>{
    const [active, setActive] = useState('position')
    const {isPOR,userstatus,pl,al,sl,rl} = useSelector(state => ({
        isPOR: state.user.moblist.isPOR,
        userstatus: state.user.userstatus,
        pl: state.user.userTraInfo.pl,
        al: (state.user.userTraInfo.activeOrder).length,
        sl: (state.user.userTraInfo.stopOrder).length,
        rl: (state.user.reserve.reserveMargin).length
    }))
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const onClickChangeActive = status => {
        if (active !== status) {
            setActive(status)
        }
    };
    const onClickChangeIsPOR = () =>{
        dispatch({type:'user/CHANGE_MOBLIST_ISPOR',payload: !isPOR})
    }

    return(
        <div className="future-mob-container">
            <div className="future-mob-header">
           
            <Nav tabs>
            <NavItem>
                <NavLink
                className={
                    classnames({ active: active === 'position' }) +
                    ' ordertab ' +
                    classnames({ active: active === 'position' })
                }
                onClick={() => onClickChangeActive('position')}
                >
                     {t('positions.position.title')} ({pl})
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                className={
                    classnames({ active: active === 'active' }) +
                    ' ordertab ' +
                    classnames({ active: active === 'active' })
                }
                onClick={() => onClickChangeActive('active')}
                >
                   {t('positions.activeorder.sub')} ({al})
                    {/* {t('positions.activeorder.title')} ({al}) */}
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                className={
                    classnames({ active: active === 'stop' }) +
                    ' ordertab ' +
                    classnames({ active: active === 'stop' })
                }
                onClick={() => onClickChangeActive('stop')}
                >
                     {t('positions.stops.title')} ({sl})
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                className={
                    classnames({ active: active === 'reserve' }) +
                    ' ordertab ' +
                    classnames({ active: active === 'reserve' })
                }
                onClick={() => onClickChangeActive('reserve')}
                >
                   {t('positions.stopreservation.sub')} ({rl})
                </NavLink>
            </NavItem>

            </Nav>
           
            <div style={{flex:"1", textAlign:"end", paddingRight:"5px", color:"#111"}}>
            {isPOR? <BsArrowsAngleContract onClick={onClickChangeIsPOR} size={15}/>:<BsArrowsAngleExpand onClick={onClickChangeIsPOR} size={15}/>}
            </div>
        
        </div>
            
        {isPOR? 
        <TabContent activeTab={active} className='screenall' style={{minHeight:"160px"}}>
            {userstatus ==='cantrade' || userstatus === 'cannottrade' ?
            <>
            <TabPane tabId='position' className='pospocon'>
               <PositionStatus
                    min={815}
                    rowH={30}
                    t={t}
               />
            </TabPane>
            <TabPane tabId='active' className='pospocon'>
                <Active min={530} t={t}/>
            </TabPane>
            <TabPane tabId='stop' className='pospocon'>
              <Stop min={540} t={t}/>
            </TabPane>
            <TabPane tabId='reserve' className='pospocon'>
               <Reserve min={600} t={t}/>
            </TabPane>
            </>:<NotLog/>}
        </TabContent>
        :<></>}
        </div>
    )
}
export default Mob;