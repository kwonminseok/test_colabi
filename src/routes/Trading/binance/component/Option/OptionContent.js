import React from 'react';
import { connect } from 'react-redux';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Table } from 'reactstrap';
import PriceReach from './component/PriceReach';
import VolumeOption from './component/VolumeOption';

class OptionContent extends React.Component {
  render () {
    return (
      <>
        <PriceReach />
        <VolumeOption/>
      </>
    );
  }
}

const mapStateToProps = ({ option }) => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OptionContent);
