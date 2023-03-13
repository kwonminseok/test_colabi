import React,{useEffect, useState, useMemo} from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Dropdown from 'react-dropdown';
import SyncLoader from "react-spinners/SyncLoader";
import Propfitdiv from './Propfitdiv'
import ProLossdiv from './ProLossdiv'
import Lossdiv from './Lossdiv';

const localizer = momentLocalizer(moment);

function eventPropGetter(event){
    if(event.bool){
      return { className: "in-event-content"}
    }else{
      return {className: "out-event-content"}
    }
}

function calcAll(income, calNow,contract){
    let profit =0;
    let loss = 0;
    let next = new Date(calNow);
    next.setMonth(next.getMonth() + 1);
    let nextTimestamp = next.getTime();
    if(contract === 'ALL'){
        _.forEach(income, item => {
            if(item.timestamp < nextTimestamp && item.timestamp > calNow){
                _.forEach(item.incomes, item2 =>{
                    if(item2.income>0){
                        profit += item2.income
                    }else {
                        loss += item2.income
                    }
                })
            }
        })
    }else{
        _.forEach(income,item => {
            if(item.timestamp < nextTimestamp && item.timestamp > calNow){
                let a = _.findIndex(item.incomes, function(o){
                    return o.symbol === contract
                })
                if(a !== -1){
                    if(item.incomes[a].income>0){
                        profit += item.incomes[a].income;
                    }else loss +=item.incomes[a].income;
                }
            }
        })
    }
    return [parseFloat(profit).toFixed(2),parseFloat(loss).toFixed(2), parseFloat(profit+loss).toFixed(2)];
}

const PnlListCalender = (props) =>{
    const { t } = useTranslation();
    const [width, setWidth] = useState(window.innerWidth)
    const [nowContract, setNowContract] = useState('ALL')
    const { income, calNow, contactlist,isReady} = props;
    useEffect(()=>{
        window.addEventListener('resize', updateWindowDimensions)
    
     
        function updateWindowDimensions(){
          setWidth(window.innerWidth)
        }
    
        return () =>window.removeEventListener('resize', updateWindowDimensions)
    
    },[])

    const setEvents = (income,calNow,contract) => {
        let next = new Date(calNow);
        next.setMonth(next.getMonth() + 1);
        let nextTimestamp = next.getTime();
        let events = [];
        
        if(contract === 'ALL'){
            _.forEach(income, item => {
                let pnl = 0;
                if (item.timestamp < nextTimestamp && item.timestamp > calNow) {
                    _.forEach(item.incomes, item2 => {
                        pnl+= item2.income
                    })
                    if(pnl>0){
                        events.push({
                            title: getPlustitle(pnl),
                            start: item.date,
                            end: item.date,
                            bool: true
                        })
                        
                    }else{
                        events.push({
                            title:  getMinustitle(Math.abs(pnl)),
                            start: item.date,
                            end: item.date,
                            bool: false
                        })  
                    }
                }
              });
        }else{
            _.forEach(income, item => {
                if (item.timestamp < nextTimestamp && item.timestamp > calNow) {
                    let a = _.findIndex(item.incomes, function(o){
                        return o.symbol === contract
                    })
                    if(a !== -1){
                        if(item.incomes[a].income>0){
                            events.push({
                                title: getPlustitle(item.incomes[a].income),
                                start: item.date,
                                end: item.date,
                                bool: true
                            })
                        }else{
                            events.push({
                                title:  getMinustitle(Math.abs(item.incomes[a].income)),
                                start: item.date,
                                end: item.date,
                                bool: false
                            })  
                        }
                    }
                    
                }
              });
        }
       
    
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

    const evt = useMemo(()=> setEvents(income, calNow,nowContract),[income, calNow,nowContract])
    const all = useMemo(() =>calcAll(income, calNow,nowContract),[income, calNow,nowContract])
    
    return (
        <>
         <div style={{display:"flex", flex:"1 1 0%", marginBottom:"10px"}}>
            <div style={{display:"flex", flex:"1 1 0%", lineHeight:"40px"}}>
            </div>
            <div style={{display:"flex"}}>
                <span style={{marginRight:"12px", lineHeight:"40px"}}>{t('balance.pnlhistory.contract')} </span>
                <Dropdown arrowClassName='myArrowClassName'
                    options={contactlist}
                    value ={nowContract}
                    onChange={value => setNowContract(value.value)}
                />
            </div>
        </div>
        <div className="balacetototal-con">
                <div style={{width:"33%"}}>
                    <div className="balance-header-total">{t('balance.pnlhistory.totalprofit')}</div>
                    <div  className="balanceBase" >
                    <Propfitdiv num={all[0]} classs="pnlprice"/>
                        <div className="pnlusdt"> USDT</div>
                    </div>
                </div>
                <div style={{width:"33%"}}>
                    <div className="balance-header-total">{t('balance.pnlhistory.totalloss')}</div>
                    <div  className="balanceBase" >
                    <Lossdiv num={all[1]} classs="pnlprice"/>
                        <div className="pnlusdt"> USDT</div>
                    </div>
                </div>
                <div style={{width:"33%"}}>
                    <div className="balance-header-total">{t('balance.pnlhistory.netpnl')}</div>
                    <div  className="balanceBase" >
                        <ProLossdiv num={all[2]} classs="pnlprice"/>
                        <div className="pnlusdt"> USDT</div>
                    </div>
                </div>
         </div>
         {isReady?
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
                //onDrillDown={evt => console.log(evt)}
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
    )


}
export default PnlListCalender;