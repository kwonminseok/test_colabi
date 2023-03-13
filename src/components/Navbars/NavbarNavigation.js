import React from 'react';
import PropTypes from 'prop-types';

import {
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { Nav, NestedDropdown } from '..';

const NavbarNavigation = ({ accent, pills, ...navbarProps }) => {
  
  return(
  <Nav navbar  accent={accent} pills={pills} {...navbarProps}>
    <NestedDropdown nav inNavbar>
      <DropdownToggle nav  tag={'a'} href='/trade/binance/BTCUSDT' className={'homeSkmclw hometitile'+navbarProps.isShown}>
        {navbarProps.trade}
      </DropdownToggle>
    </NestedDropdown>
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav  tag={'a'} className={'homeSkmclw hometitile'+navbarProps.isShown} href='/support/notice'>
        {navbarProps.contact}
      </DropdownToggle>
    </UncontrolledDropdown>
  </Nav>
  )
};
NavbarNavigation.propTypes = {
  pills: PropTypes.bool,
  accent: PropTypes.bool,
};

export { NavbarNavigation };
