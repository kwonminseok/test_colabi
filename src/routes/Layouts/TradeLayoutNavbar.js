import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {NavbarBrand} from 'reactstrap';
import { Nav, NavbarThemeProvider, Navbar } from '../../components';
import NavbarSetting from './component/NavbarSetting';
import NavbarNotlogTrade from './component/NavbarNotlogTrade';
import bitcolabi2 from '../../icons/bitcolabi2.svg';
import LangDropdown from './component/LangDropdown';
import CustomLayout from './component/CustomLayout'

export const TradeLayoutNavbar = () => {
  const logstatus = useSelector(state => state.user.logstatus);
  const mbc = useSelector(state => state.user.mbc);
  const { t, i18n } = useTranslation();



  return (
    <NavbarThemeProvider className='shadow-sm'> 
      <Navbar className='mainpagetrue' expand='lg' themed>
        <a href='/' className='navb-brand mr-0 mr-sm-3'>
          <NavbarBrand className='mb-0' tag='div'>
            <img src={bitcolabi2} alt='bitcolabi Logo' />
          </NavbarBrand>
        </a>
            {/* <TradeNavigation  /> */}
        <Nav className='ml-auto ' pills >
        {logstatus === 'LOGIN' ? (
          <div className='css-a23lsd'>
            <NavbarSetting />
          </div>
        ) : logstatus === 'LOGOUT' ? (
          mbc.mb==='sm'?
          <div className='css-a23lsd'>
            <NavbarNotlogTrade/>
          </div>:
          <div className="homenotlog">
            <a href='/login' className={'mr-0 mr-sm-3 hometitilefalse'} >
              {t('login.title')}
            </a>
            <a href='/register' className={'  mr-0 mr-sm-3 hometitilefalse'}>
              {t('register.title')}
            </a>
          </div>
        ) : (
          <></>
        )}
        <div className='navb-brand'>
          <LangDropdown
          t={t}/>
        </div>
        {mbc.check ==='done' && mbc.mb === 'lg'?
        <CustomLayout/>
              :<></>}
            </Nav>
          </Navbar>
        </NavbarThemeProvider>

  );
};
