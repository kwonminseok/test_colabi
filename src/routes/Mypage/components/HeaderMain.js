import React from 'react';
import PropTypes from 'prop-types';

const HeaderMain = (props) => (
    <React.Fragment>
        { /* START H1 Header */}
        <div className={` d-flex ${ props.className }` }>
            <h1 className="account-header mr-3 mb-2 align-self-start">
                { props.title }
            </h1>
        </div>
        { /* END H1 Header */}
    </React.Fragment>
)
HeaderMain.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.node,
    className: PropTypes.string
};
HeaderMain.defaultProps = {
    title: "Waiting for Data...",
    subTitle: "Waiting for Data...",
    className: "my-4"
};

export { HeaderMain };
