/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Navbar as BSNavbar, Container } from 'reactstrap';

const Navbar = ({
  themed,
  fluid,
  shadow,
  className,
  children,
  dark,
  light,
  color,
  ...otherProps
}) => {
  let navbarClass = classNames(
    {
      'navbar-themed': themed || !!color,
      'navbar-shadow': shadow,
    },
    'navbar-multi-collapse',
    className,
  );

  // When a combination of light or dark is present
  // with a color - use a custom class instead of bootstrap's
  if ((dark || light) && color) {
    navbarClass = classNames(
      navbarClass,
      `navbar-${light ? 'light' : ''}${dark ? 'dark' : ''}-${color} navShadow`,
    );
  }

  return (
    <BSNavbar
      className={navbarClass}
      /*
                Use the dark and light switches
                only when color is not set
            */
      dark={dark && !color}
      light={light && !color}
      {...otherProps}
    >
      {
        <Container className="maxnonon navbar-collapse-wrap" fluid={fluid}>
          {children}
        </Container>
      }
    </BSNavbar>
  );
};
Navbar.propTypes = {
  themed: PropTypes.bool,
  fluid: PropTypes.bool,
  shadow: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
  dark: PropTypes.bool,
  light: PropTypes.bool,
};
Navbar.defaultProps = {
  fluid: false,
  themed: false,
};

export { Navbar };
