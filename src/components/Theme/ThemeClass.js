/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';

import { Consumer } from './ThemeContext';

const ThemeClass = ({ children, color, style }) => {
  const layoutThemeClass = `layout--theme--${style}--${color}`;

  return children(layoutThemeClass);
};
ThemeClass.propTypes = {
  children: PropTypes.func.isRequired,
  color: PropTypes.string,
  style: PropTypes.string,
};

const ContextThemeClass = (props) => (
  <Consumer>
    {(themeState) => <ThemeClass {...themeState} {...props} />}
  </Consumer>
);

export { ContextThemeClass as ThemeClass };
