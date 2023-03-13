import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavbarBrand } from 'reactstrap';
import { Nav, NavbarThemeProvider, Navbar } from '../../components';
import { NavbarNavigation } from '../../components/Navbars/NavbarNavigation';
import bitcolabi from '../../icons/bitcolabi.svg';
import bitcolabi2 from '../../icons/bitcolabi2.svg';
import NavbarHome from './component/NavbarHome';
import NavbarNotlogHome from './component/NavbarNotlogHome'
import Cookies from 'js-cookie';
import Dropdown from 'react-dropdown';

const langList = [{ value: 'en', label: 'English',className: 'lang-drop-option' },
{ value: 'cn', label: '中文',className: 'lang-drop-option' },
{ value: 'ru', label: 'Русский',className: 'lang-drop-option' },
{ value: 'ko', label: '한국어',className: 'lang-drop-option' },
{ value: 'ja', label: '日本語',className: 'lang-drop-option' }]


const LayoutNavbar = () => {
  const logstatus = useSelector(state => state.user.logstatus);
  const mbc = useSelector(state => state.user.mbc)
  const { t, i18n } = useTranslation();
  const [isshown, setIsshown] = useState(false);
  const setLang = lang => {
    Cookies.set('Lang', lang, { expires: 365, path: '/' });
    window.location.reload();
  };
  return (
    <NavbarThemeProvider className='shadow-sm'>
      <Navbar 
        onMouseEnter={() => setIsshown(true)}
        onMouseLeave={() => setIsshown(false)} 
        className={"mainpage"+!isshown} expand='lg' themed
      > 
        <a href='/' className='navb-brand mr-0 mr-sm-3'>
          <NavbarBrand className='mb-0' tag='div' style={{ minWidth: '150px' }}>
            {isshown? <img src={bitcolabi} alt='bitcolabi Logo' /> : <img src={bitcolabi2} alt='bitcolabi Logo' />}
          </NavbarBrand>
        </a>
        {mbc.mb !== 'sm' ?<NavbarNavigation  className={"homeui homeui"+ isshown}
        trade={t('trade')}
        contact={t('contact.title')}
        isShown={isshown}
        /> : <></> }
        <Nav className='ml-auto' pills>
          {logstatus === 'LOGIN' ? (
            <div className='css-a23lsd'>
              <NavbarHome 
              isshown={isshown}/>
            </div>
          ) : logstatus === 'LOGOUT' ? (
            <>
            {mbc.mb === 'sm'?  
            <div className='css-a23lsd'>
              <NavbarNotlogHome/>
            </div> :
            <div className="homenotlogged">
              <a href='/login' className={'mr-0 mr-sm-3 hometitile'+isshown}>
                {t('login.title')}
              </a>
              <a href='/register' className={' mr-0 mr-sm-3 hometitile'+isshown}>
                {t('register.title')}
              </a>
            </div>
            }
            </>
          ) : (
            <></>
          )}
          <div className='navb-brand '>
            <Dropdown 
              arrowClassName='lang-drop-arrow'
              controlClassName={"lang-drop-control "+isshown}
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
  );
};

export default LayoutNavbar;
