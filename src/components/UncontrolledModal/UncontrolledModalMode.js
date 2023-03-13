import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Consumer } from './context';

const UncontrolledModalMode = props => {
  const { tag, ...otherProps } = props;
  const Tag = tag;
  return (
    <Consumer>
      {value => (
        <Tag
          {...otherProps}
          onClick={() => {
            value.toggleModal();
            console.log(otherProps);
          }}
        />
      )}
    </Consumer>
  );
};
UncontrolledModalMode.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};
UncontrolledModalMode.defaultProps = {
  tag: Button,
};

export { UncontrolledModalMode };
