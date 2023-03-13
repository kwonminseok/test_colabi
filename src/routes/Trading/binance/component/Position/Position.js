import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  Nav,
} from '../../../../../components';
import classnames from 'classnames';
import { CardBody, NavItem, NavLink, TabPane ,TabContent} from 'reactstrap';
import PositionStatus from './component/PositionStatus';
import Active from './component/Active';
import Reserve from './component/Reserve';
import Stop from './component/Stop';
import { RiCloseFill } from "react-icons/ri";

const Position = (props) =>{
  const [active, setActive] = useState('position')
  const {min,activeMin,stopMin,reserveMin, close}= props;
  const {userstatus,pl,al,sl,rl} = useSelector(state => ({
    userstatus: state.user.userstatus,
    pl: state.user.userTraInfo.pl,
    al: (state.user.userTraInfo.activeOrder).length,
    sl: (state.user.userTraInfo.stopOrder).length,
    rl: (state.user.reserve.reserveMargin).length
  }))
  const { t } = useTranslation();

  const onClickChangeActive = status => {
    if (active !== status) {
      setActive(status)
    }
  };

  const generateDOM = () => {
    switch (userstatus) {
      case 'guest': {
        return (
          <div className='flex-1 reserve'>
            <a style={{ marginRight: '3px' }} href='/login'>
              {t('login.title')}
            </a>{' '}
              {t('notvalid.or')}
            <a
              style={{ marginRight: '6px', marginLeft: '3px' }}
              href='/register'
            >
              {t('register.title')}
            </a>
            {t('notvalid.totrade')}
          </div>
        );
      }
      case 'apiinvalid': {
        return (
          <div className='flex-1 reserve'>
            {t('notvalid.validapi')}
            <a style={{ marginLeft: '8px' }} href='/mypage/account'>
              {t('notvalid.modifyapi')}
            </a>
          </div>
        );
      }
      case 'noneapi': {
        return (
          <div className='flex-1 reserve'>
            <a style={{ marginLeft: '8px' }} href='/mypage/account'>
              {t('notvalid.registerapi')}
            </a>
          </div>
        );
      }
      case 'cannottrade': {
        return (
          <div className='flex-1 reserve'>{t('notvalid.cantnottrade')}</div>
        );
      }
      case 'notmember': {
        return (
          <div className='flex-1 reserve'>
            <a style={{ marginLeft: '8px' }} href='/mypage/account'>
              {t('notvalid.joinmembership')}
            </a>
          </div>
        );
      }
      case 'cantrade':{
        return(
          <TabContent activeTab={active} className='screenall'>
          <TabPane tabId='position' className='pospocon'>
            <PositionStatus min={min} rowH={40} t={t}/>
          </TabPane>
          <TabPane tabId='activeorder' className='pospocon'>
            <Active  min={activeMin} t={t}/>
          </TabPane>
          <TabPane tabId='stoporder' className='pospocon'>
            <Stop min={stopMin} t={t}/>
          </TabPane>
          <TabPane tabId='reserve' className='pospocon'>
            <Reserve  min={reserveMin} t={t}/>
          </TabPane>
        </TabContent>
        )
      }
      default:{
        return<></>
      }
    }
  }

  return (
    <>
      <Card className="positionborder" style={{ height: '100%', borderRadius: '0' }}>
          <CardHeader
            className='titleheader draggableHandle'
            style={{ paddingBottom: '0', fontWeight:"normal", color:"inherit"}}
          >
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={
                    classnames({ active: active === 'position' }) +
                     ' draggableCancel positiontab ' +
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
                    classnames({ active: active === 'activeorder' }) +
                     ' draggableCancel positiontab ' +
                    classnames({ active: active === 'activeorder' })
                  }
                  onClick={() => onClickChangeActive('activeorder')}
                  >
                   {t('positions.activeorder.title')} ({al})
                </NavLink>
              </NavItem>
               <NavItem>
                <NavLink
                  className={
                    classnames({ active: active === 'stoporder' }) +
                     ' draggableCancel positiontab ' +
                    classnames({ active: active === 'stoporder' })
                  }
                  onClick={() => onClickChangeActive('stoporder')}
                  >
                    {t('positions.stops.title')} ({sl})
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={
                    classnames({ active: active === 'reserve' }) +
                     ' draggableCancel positiontab ' +
                    classnames({ active: active === 'reserve' })
                  }
                  onClick={() => onClickChangeActive('reserve')}
                  >
                    {t('positions.stopreservation.title')} ({rl})
                </NavLink>
              </NavItem>
            </Nav>
            {close ? 
            <RiCloseFill className="closebt" size={16} onClick={props.onClick}/>
            :<></>}
          </CardHeader>
          <CardBody className='futureoverfowdlposition' >
            {generateDOM()}
          </CardBody>
      </Card>
    </>
  );

}

export default Position;