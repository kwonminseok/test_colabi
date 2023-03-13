import React, { PureComponent } from 'react';
import { CardBody } from 'reactstrap';
import Trade from './component/Trade';
class RecentTrade extends PureComponent {
  render () {
    return (
      <CardBody className='futureoverfowdl2'>
        <Trade />
      </CardBody>
    );
  }
}

export default RecentTrade;
