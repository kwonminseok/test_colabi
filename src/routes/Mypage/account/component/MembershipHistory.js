import React, {useCallback} from 'react';
import _ from 'lodash';
import { Table } from 'reactstrap';
import { withTranslation } from 'react-i18next';

function invertDate (tiemstamp) {
  let a= new Date(tiemstamp).toISOString();
  return a.substring(0,10)
}

const MembershipHistory = (props) =>{
  const {history, t} = props;

  const generateDOM = useCallback(() => {
    return _.map(history, item => {
      return (
        <tr key ={item.Time}>
          <td className='account-history text-left align-middle bt-0'>{invertDate(item.Time)}</td>
          <td className='account-history text-left align-middle bt-0'>{item.Amount ===0 ? "-": item.Amount}</td>
          <td className='account-history text-left align-middle bt-0'>{item.Membership}</td>
          <td className='account-history  align-middle bt-0'>{invertDate(item.Expired)}</td>
        </tr>
      );
    });
  },[history])

  return (
    <div className='table-responsive-xl' >
      <Table className='mb-0' style={{ width: '100%' }}>
        <thead>
          <tr style={{borderBottom:"1px solid #E9ECEF"}}>
            <th
              style={{ borderBottom: 'none', width: '25%' }}
              className='acc text-left align-middle bt-0'
            >
              Date
            </th>
            <th
              style={{ borderBottom: 'none', width: '25%' }}
              className='acc text-left align-middle bt-0'
            >
              Billing
            </th>
            <th
              style={{ borderBottom: 'none', width: '25%' }}
              className='acc text-left align-middle bt-0'
            >
              Action
            </th>
            <th
              style={{ borderBottom: 'none', width: '25%' }}
              className='acc text-left align-middle bt-0'
            >
              Expired
            </th>
          </tr>
        </thead>
        <tbody>
        {generateDOM()}
        </tbody>
      </Table>
    </div>
  );
}

export default MembershipHistory;


