import React from 'react';
import {
    UncontrolledDropdown,
    DropdownToggle,
    ListGroup,
    ListGroupItem,
  } from 'reactstrap';
  import { useTranslation } from 'react-i18next';
  import { ExtendedDropdown } from '../../../components';
  import { FaRegAddressCard } from 'react-icons/fa';
  import { RiMenuLine } from 'react-icons/ri';
  import {
    RiWalletLine,
  } from 'react-icons/ri';
const NavbarNotlogTrade = props => {
  const { t, i18n } = useTranslation();
  return(
    <UncontrolledDropdown
      style={{ outline: 'none !important' }}
      nav
      inNavbar
      {...props}
    >
      <DropdownToggle nav className="hometitilefalse">
        <RiMenuLine size={23} />
      </DropdownToggle>
      <ExtendedDropdown right style={{ outline: 'none !important', border:"none" }} className="nav-toggle-layout">
      <ExtendedDropdown.Section className="nav-ex-drop" style={{padding:"0"}}>
          <ListGroup style={{ padding: '0', border: 'none' }}>
            <ListGroupItem tag={'a'} href='/login'className="nav-list-item" action>
              <div>
              <FaRegAddressCard size={22} />
              </div>
              <span  style={{ paddingLeft: '10px', fontSize: '15px' }}>
              {t('navbaraccount.login')}
              </span>
            </ListGroupItem>
            <ListGroupItem tag={'a'} href='/register' className="nav-list-item" action>
              <div>
                <RiWalletLine size={22} />
              </div>
              <span style={{ paddingLeft: '10px', fontSize: '15px' }}>
              {t('navbaraccount.createaccount')}
              </span>
            </ListGroupItem>
          </ListGroup>
        </ExtendedDropdown.Section>
      </ExtendedDropdown>
    </UncontrolledDropdown>
)
}


export default NavbarNotlogTrade;