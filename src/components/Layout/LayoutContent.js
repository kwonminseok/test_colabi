/* eslint-disable import/prefer-default-export */
/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';

const LayoutContent = (props) => (
  <div className="layout__content" style={{padding:"0px"}}>{props.children}</div>
);

LayoutContent.propTypes = {
  children: PropTypes.node,
};
LayoutContent.layoutPartName = 'content';

export { LayoutContent };
