import React, {useState, useEffect, useMemo} from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SyncLoader from "react-spinners/SyncLoader";
import Lossdiv from './Lossdiv';
import Propfitdiv from './Propfitdiv'
const localizer = momentLocalizer(moment);




function calcAll(transferlist, calNow){
  let deposit =0;
  let withdraw = 0;
  let next = new Date(calNow);
  next.setMonth(next.getMonth() + 1);
  let nextTimestamp = next.getTime();
    _.forEach(transferlist, item => {
      if(item.timestamp < nextTimestamp && item.timestamp > calNow){
          deposit += item.deposit;
          withdraw += item.withdraw;
      }
  })
  return [parseFloat(deposit).toFixed(2), parseFloat(withdraw).toFixed(2)];
}

function eventPropGetter(event){
  if(event.bool){
    return { className: "in-event-content"}
  }else{
    return {className: "out-event-content"}
  }
}

const ListCalendar = (props) =>{
  const [width, setWidth] = useState(window.innerWidth)
  const { t } = useTranslation();
  const { calNow, transferlist, isReady} = props;

  useEffect(()=>{
    window.addEventListener('resize', updateWindowDimensions)


    function updateWindowDimensions(){
      setWidth(window.innerWidth)
    }

    return () =>window.removeEventListener('resize', updateWindowDimensions)

  },[])

  const setEvents = (transferlist, calNow) => {
    let next = new Date(calNow);
    next.setMonth(next.getMonth() + 1);
    let nextTimestamp = next.getTime();
    let events = [];
    _.forEach(transferlist, item => {
      if (item.timestamp < nextTimestamp && item.timestamp > calNow) {
        if (item.deposit > 0) {
          events.push({
            title: getPlustitle(item.deposit),
            start: item.date,
            end: item.date,
            bool: true
          });
        }
        if (item.withdraw > 0) {
          events.push({
            title: getMinustitle(item.withdraw),
            start: item.date,
            end: item.date,
            bool: false
          });
        }
      }
    });
  
    return events;
  };

  const getPlustitle = (num) => {
    if(width>485){
      return '+' + parseFloat(num).toFixed(2)
    }else{
      return parseFloat(num).toFixed(1)
    }
  }

  const getMinustitle = (num) => {
    if(width>485){
      return '-' + parseFloat(num).toFixed(2)
    }else{
      return parseFloat(num).toFixed(1)
    }
  }

  const evt = useMemo(()=> setEvents(transferlist, calNow),[transferlist, calNow,setEvents])
  const all = useMemo(() =>calcAll(transferlist, calNow),[transferlist, calNow])
  return (
    <>
      <div className="balacetototal-con">
        <div className="balance-tranfer-total">
          <div className="balance-header-total">{t('balance.dwhistory.totaldeposit')}</div>
          <div className='balanceBase'>
            <Propfitdiv
            num={all[0]}
            />
          {/* {profitdiv(all[0])} */}
            <div> USDT</div>
          </div>
        </div>
        <div className="balance-tranfer-total">
          <div className="balance-header-total">{t('balance.dwhistory.totalwithdraw')}</div>
          <div className='balanceBase'>
            <Lossdiv
            num ={all[1]}
            />
          {/* {lossdiv(all[1])} */}
            <div> USDT</div>
          </div>
        </div>
      </div>
      {isReady ?
        <BigCalendar
          className="calender-h"
          events={evt}
          defaultView={'month'}
          date={new Date(calNow)}
          onNavigate={date => {
            this.setState({ selectedDate: date });
          }}
          localizer={localizer}
          toolbar={false}
          eventPropGetter={(eventPropGetter)}
        />
        :
        <div style={{width:"100%", minHeight:"200px", textAlign:"center", display:"flex"}}>
          <div style={{flex:"1 1 0%", placeSelf:"center"}}>
            <SyncLoader
                size={10}
                color="#58b589"
                margin="2px" />
          </div>
        </div>
        }
    </>
  );

}

export default ListCalendar;