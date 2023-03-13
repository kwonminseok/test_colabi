import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ExtendedDropdown } from '../../../components';
import {
  UncontrolledDropdown,
  DropdownToggle,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import {
  RiLogoutCircleRLine,
  RiWalletLine,
} from 'react-icons/ri';
import { FaRegAddressCard, FaUserCircle } from 'react-icons/fa';
import { authLogout } from '../../../store/modules/user';

const NavbarSetting = props => {
  const { t, i18n } = useTranslation();
  const user  = useSelector(state =>state.user.userInfo);
  const dispatch = useDispatch();
  const handleCickLogOut = () => {
    dispatch(authLogout(user.id));
  };
  

  return (
    <UncontrolledDropdown
      nav
      inNavbar
      {...props}
      style={{ outline: 'none !important'}}
    >
      <DropdownToggle nav className="hometitilefalse">
        <FaUserCircle size={23} />
      </DropdownToggle>
      <ExtendedDropdown right style={{ outline: 'none', border:"none" }}>
        <ExtendedDropdown.Section className='d-flex justify-content-between align-items-center navbarsetting '>
          {user.nick}
        </ExtendedDropdown.Section>
        <ExtendedDropdown.Section style={{ padding: '0' }}>
          <ListGroup style={{ padding: '0', border: 'none', }}>
            <ListGroupItem tag={'a'} href='/mypage/account' style={{ border: 'none',display:"flex"  }} action>
              <div>
              <FaRegAddressCard size={22} />
              </div>
              <span style={{ paddingLeft: '10px', fontSize: '15px' }}>
              {t('navbaraccount.logged.account')}
              </span>
            </ListGroupItem>
            <ListGroupItem tag={'a'} href='/mypage/balance' style={{ border: 'none',display:"flex"  }} action>
              <div>
                <RiWalletLine size={22} />
              </div>
              <span style={{ paddingLeft: '10px', fontSize: '15px' }}>
              {t('navbaraccount.logged.balance')}
              </span>
            </ListGroupItem>
          </ListGroup>
        </ExtendedDropdown.Section>
        <ExtendedDropdown.Section style={{ padding: '0' }}>
          <ListGroup style={{ padding: '0', border: 'none' }}>
            <ListGroupItem
              tag={'button'}
              onClick={handleCickLogOut}
              style={{ border: 'none', outline: 'none', display:"flex" }}
              action
            >
              <div>
              <RiLogoutCircleRLine size={22} />
              </div>
              <span style={{ paddingLeft: '10px', fontSize: '15px' }}>
              {t('navbaraccount.logged.logout')}
              </span>
            </ListGroupItem>
          </ListGroup>
        </ExtendedDropdown.Section>
      </ExtendedDropdown>
    </UncontrolledDropdown>
  );
};

export default NavbarSetting;
