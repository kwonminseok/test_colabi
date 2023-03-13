/* eslint-disable import/prefer-default-export */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink as Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavLink,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap';
import { Nav, NestedDropdown } from ".."

var btcper = 0;
var ethper =0;
var linkper = 0;
var btcclass = '';
var ethclass = '';
var linkclass = '';

var btcselcect = 'tradesymbol';
var ethselcect = 'tradesymbol';
var linkselcect = 'tradesymbol';

const TradeNavigation = ({ accent, pills, ...navbarProps }) => {
  const symbol = useSelector(state =>state.websocket.symbol);
  const futureDaliy = useSelector(state => state.websocket.futuredaily)
  

  futureDaliy.forEach(item =>{
    switch(item.s){
      case 'BTCUSDT':{
        btcper = parseFloat(Math.ceil(((item.c/item.o)-1)*10000)/100).toFixed(2)
        if(btcper>0) btcclass ='plusper'
        else if(btcper<0) btcclass ='minusper'        
        break;
      }
      case 'ETHUSDT':{
        ethper = parseFloat(Math.ceil(((item.c/item.o)-1)*10000)/100).toFixed(2)
        if(ethper>0) ethclass ='plusper'
        else if(ethper<0) ethclass ='minusper'

        break;
      }
      case 'LINKUSDT':{
        linkper = parseFloat(Math.ceil(((item.c/item.o)-1)*10000)/100).toFixed(2)
        if(linkper>0) linkclass ='plusper'
        else if(linkper<0) linkclass ='minusper'

        break;
      }
      default: break;
    }
  })

  switch(symbol){
    case 'BTCUSDT':{
      btcselcect = 'tradesymbolsel';
      ethselcect = 'tradesymbol';
      linkselcect = 'tradesymbol';
      break;
    }
    case 'ETHUSDT':{
      btcselcect = 'tradesymbol';
      ethselcect = 'tradesymbolsel';
      linkselcect = 'tradesymbol';
      break;
    }
    case 'LINKUSDT':{
      btcselcect = 'tradesymbol';
      ethselcect = 'tradesymbol';
      linkselcect = 'tradesymbolsel';
      break;
    }
  }

  
  return(
  <Nav navbar  pills={pills} {...navbarProps}>
    <UncontrolledDropdown nav inNavbar className={btcselcect} style={{marginRight:"13px"}}>
      <DropdownToggle nav tag={Link} to="/trade/binance/BTCUSDT" className='homeSkmclw'>
        <span style={{marginRight:"0.5rem"}}>BTCUSDT</span> <span className={btcclass}>{btcper}%</span>
      </DropdownToggle>
    </UncontrolledDropdown>
    <UncontrolledDropdown nav inNavbar className={ethselcect} style={{marginRight:"13px"}}>
      <DropdownToggle nav tag={Link} to="/trade/binance/ETHUSDT" className='homeSkmclw'>
      <span style={{marginRight:"0.5rem"}}>ETHUSDT</span> <span className={ethclass}>{ethper}%</span>
      </DropdownToggle>
    </UncontrolledDropdown>
    <UncontrolledDropdown nav inNavbar className={linkselcect}>
      <DropdownToggle nav tag={Link} to="/trade/binance/LINKUSDT" className='homeSkmclw'>
      <span style={{marginRight:"0.5rem"}}>LINKUSDT</span> <span className={linkclass}>{linkper}%</span>
      </DropdownToggle>
    </UncontrolledDropdown>

    {/* <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav tag={'a'} href="/contact" className='homeSkmclw'>
        Contact
      </DropdownToggle>
    </UncontrolledDropdown> */}
  </Nav>
  )
};
TradeNavigation.propTypes = {
  pills: PropTypes.bool,
  accent: PropTypes.bool,
};

export { TradeNavigation };
