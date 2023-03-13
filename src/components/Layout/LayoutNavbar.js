/* eslint-disable import/prefer-default-export */
/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const LayoutNavbar = props => {
  const navbar = React.Children.only(props.children);
  const symbol = useSelector(state => state.websocket.symbol);
  //const isHome = useSelector(state => state.home.isHome)
  return (
    <>
      {symbol !== '' ? (
        <div style={{position:"initial"}} className='layout__navbar'>
          {React.cloneElement(navbar, { fixed: null })}
        </div>
      ) : (
        <div className={"layout__navbar "}>
          {React.cloneElement(navbar, { fixed: null })}
        </div>
      )}
      {/* <div className='layout__navbar'>
        {React.cloneElement(navbar, { fixed: null })}
      </div> */}
    </>
  );
};

LayoutNavbar.propTypes = {
  children: PropTypes.node,
};
LayoutNavbar.layoutPartName = 'navbar';

export { LayoutNavbar };
