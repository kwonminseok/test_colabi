import React, {useState, useEffect} from 'react';
import _ from 'lodash'
import {useSelector} from 'react-redux';
import PnlListTable from './PnlListTable'
import PnlListCalendar from './PnlListCalendar'


function setPeriodList(transferlist,startPeriod){
  return _.filter(transferlist, function(o){
    return o.timestamp>=startPeriod
  })
}


const PnlList = (props) =>{
  const [contactlist, setContactlist]= useState([]);
  const { view,period,startPeriod,startDate,endDate,calNow } = props;
  const income = useSelector(state => state.user.transfer.income)
  const status = useSelector(state => state.user.transfer.isIncomeReady)

  useEffect(()=>{
    getContractList()

  },[period,income])


  const getContractList = ()=>{
    let list = [];
    _.forEach(income, item =>{
        if(item.timestamp>= startPeriod){
            _.forEach(item.incomes, item2 =>{
                let ind = _.findIndex(list, function(o){
                    return o === item2.symbol
                })
                if(ind ===-1){
                    list.push(item2.symbol)
                }
            })
        }
    })
    list.unshift("ALL")
    setContactlist(list)
   
  } 


  return(
    <>
    <div style={{marginTop:"15px", marginLeft:"15px"}}>
    {view === 'table' ? (
    <PnlListTable
      period={period}
      startPeriod={startPeriod}
      startDate={startDate}
      endDate={endDate}
      income={setPeriodList(income,startPeriod )}
      contactlist={contactlist}
      isReady={status}
    />
  ) : (
    <PnlListCalendar
      income={income}
      calNow={calNow}
      contactlist={contactlist}
      isReady={status}
    />
  )}
    </div>
    </>
)


}
export default PnlList;