import React from 'react';
import ListCalendar from './ListCalendar';
import _ from 'lodash'
import {useSelector} from 'react-redux';
import ListTable from './ListTable';

function setPeriodList(transferlist, startPeriod){
  return _.filter(transferlist, function(o){
    return o.timestamp>=startPeriod
  })
}

const DeWithList = (props) =>{
  const { view,period,startPeriod,startDate,endDate,calNow} = props;
  const transfer = useSelector(state => state.user.transfer)

  
  return (
    <>
      <div style={{ marginTop: '15px', marginLeft: '15px' }}>
        {view === 'table' ? (
          <ListTable
            period={period}
            startPeriod={startPeriod}
            startDate={startDate}
            endDate={endDate}
            transferlist={setPeriodList(transfer.transferlist,startPeriod )}
            isReady={transfer.isTransferReady}
          />
        ) : (
          <ListCalendar
            calNow={calNow}
            transferlist={transfer.transferlist}
            isReady={transfer.isTransferReady}
          />
        )}
      </div>
    </>
  )
}
export default DeWithList;

