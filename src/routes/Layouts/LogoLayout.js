/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  NavbarBrand
} from 'reactstrap';
import { Nav, NavbarThemeProvider, Navbar } from '../../components';
import Layout from '../../components/Layout';
import bitcolabi2 from '../../icons/bitcolabi2.svg';
import Cookies from 'js-cookie';
import Dropdown from 'react-dropdown';
const langList = [{ value: 'en', label: 'English',className: 'lang-drop-option' },
{ value: 'cn', label: '中文',className: 'lang-drop-option' },
{ value: 'ru', label: 'Русский',className: 'lang-drop-option' },
{ value: 'ko', label: '한국어',className: 'lang-drop-option' },
{ value: 'ja', label: '日本語',className: 'lang-drop-option' }]
export const LogoLayout = () => {
  const { t, i18n } = useTranslation();
  const setLang = lang => {
    Cookies.set('Lang', lang, { expires: 365, path: '/' });
    window.location.reload();
  };
  return (
      <Layout.Navbar>
        <NavbarThemeProvider  className='shadow-sm'>
          <Navbar 
           className="mainpagetrue" expand='lg' themed> 
            <a href='/'  className='navb-brand mr-0 mr-sm-3'>
            <NavbarBrand className='mb-0' tag='div' style={{ minWidth: '150px' }}>
            <img src={bitcolabi2} alt='bitcolabi Logo'/>
          </NavbarBrand>
            </a>
            <Nav className='ml-auto' pills>
            <div className='navb-brand'>
                  <Dropdown 
                    arrowClassName='lang-drop-arrow'
                    controlClassName="lang-drop-control"
                    className='lang-drop-root'
                    placeholderClassName='lang-drop-place'
                    menuClassName='lang-drop-menu'
                    options={langList}
                    value ={t('lang')}
                    onChange={value => setLang(value.value)}
                  />
              </div>
            </Nav>
            
          </Navbar>
        </NavbarThemeProvider>
      </Layout.Navbar>
  );
};
