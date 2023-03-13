import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useTranslation } from 'react-i18next';
import {Container} from 'reactstrap';
import { Card } from '../../../components';
import { HeaderMain } from '../components/HeaderMain';
import { RiCalendar2Line,RiArrowRightSLine,RiArrowLeftSLine } from "react-icons/ri";
import { BsCardList } from "react-icons/bs";
import DeWithList from './component/DeWithList'
import PnlList from './component/PnlList'
import NotApi from './component/NotApi';


function setNowMonth(){
  let now = new Date().toISOString();
  return new Date(Date.UTC(now.substring(0,4),now.substring(5,7)-1,1,0,0,0)).getTime();
}

const Balancet = () =>{
  const [view, setView] = useState('table')
  const [period, setPeriod] = useState('all')
  const [nowToggle ,setNowToggle] = useState('dewith')
  const [dates, setDates] = useState({
    startDate: '',
    endDate: new Date().toISOString().substring(0,10),
    startPeriod: 0,
    calMax: setNowMonth(),
    calMin: new Date(Date.UTC(2019,8,1,0,0,0)).getTime(),
    calNow: setNowMonth(),
  })
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const logstatus = useSelector(state => state.user.logstatus)
  const isApi = useSelector(state => state.user.usercheck.isApi)
  const userBalance = useSelector(state => state.user.userBalance)
  
  const {startDate, endDate, startPeriod, calMax, calMin, calNow} = dates;

  useEffect(()=>{
    dispatch({
        type:'user/USER_AUTH_TOTAL',
        payload:'balance'
    })

    document.title = `${t('balance.title')} | Bitcolabi`;
  },[])

  useEffect(()=>{
    if(logstatus ==='LOGOUT'){
      document.location.href = '/';
    }
  },[logstatus])

  const changeNowToggle = (now) => {
    if(nowToggle !== now){
      setNowToggle(now)
      setView('table')
      setPeriod('all')
      setDates({
        ...dates,
        calNow: setNowMonth()
      })
      setStartTime('all')
    }
  }

  const changeView = (views) => {
    if(view !== views){
      setView(views)
      setPeriod('all')
      setStartTime('all')
    }
  }

  const changePeriod = (now) =>{
    if(period !== now){
      setPeriod(now)
      setStartTime(now)
    }
  }


  const classIsActive = (now) => {
    if(nowToggle !== now){
      return "balancelist-li"
    }else{
      return 'balancelist-liactive'
    }
  }

  const classIsPeriodActive = (now) => {
    if(period !== now){
      return "balance-viewbt-pd balancelist-viewbt"
    }else{
      return 'balance-viewbt-pd balancelist-viewbtactive'
    }
  }

  const classIsViewActive = (now) => {
    if(view !== now){
      return "balance-viewbt-pd balancelist-viewbt"
    }else{
      return 'balance-viewbt-pd balancelist-viewbtactive'
    }
  }

  const setStartTime = (period) => {
    let now = new Date().toISOString();
    let now5 = new Date(Date.UTC(now.substring(0,4),now.substring(5,7)-1,now.substring(8,10),0,0,0));
    switch(period){
        case 'all': {
          setDates({
            ...dates,
            startPeriod: 0,
            endDate: now.substring(0,10)
          })
          break;
        }
        case '3month':{
            now5.setMonth(now5.getMonth()-3);
            setDates({
              ...dates,
                startPeriod: now5.getTime(),
                endDate: now.substring(0,10),
                startDate: now5.toISOString().substring(0,10)
            })
            break;
        }
        case 'month':{
            now5.setMonth(now5.getMonth()-1);
            setDates({
              ...dates,
              startPeriod: now5.getTime(),
              endDate: now.substring(0,10),
              startDate: now5.toISOString().substring(0,10)
            })
            break;
        }
        case 'week':{
            now5.setDate(now5.getDate()-7);
            setDates({
              ...dates,
              startPeriod: now5.getTime(),
              endDate: now.substring(0,10),
              startDate: now5.toISOString().substring(0,10)
            })
            break;
        }
        case 'day':{
          setDates({
            ...dates,
            startPeriod: now5.getTime(),
            endDate: now.substring(0,10),
            startDate: now5.toISOString().substring(0,10)
          })
            break;
        }
        default:{
            break;
        }
  
    }
  }

  const setNowMothAgo = (calNow) => {
    let a = new Date(calNow);
    a.setMonth(a.getMonth()-1);
    setDates({
      ...dates,
      calNow: a.getTime()
    })
  }

  const setNowMonthNext = (calNow) => {
    let a = new Date(calNow);
    a.setMonth(a.getMonth()+1);
    setDates({
      ...dates,
      calNow: a.getTime()
    })
  }
  
  const getNowDate = () => {
    return new Date(calNow).toISOString().substring(0,7)
  }


  return (
    <Container style={{minHeight:"calc(100vh - 165px)"}}>
     <HeaderMain title={t('balance.title')} className='mb-2 mt-4' />
    {isApi === 'valid' ?
      userBalance.wallet !== ''?  
      <Card className="cardcontainer">
        <div >
          <div>
            <div className="balance-header-total">{t('balance.marginbalance')}</div>
            <div className="balanceBase" style={{marginBottom:"10px"}}>
            <div className="balance-price-big"> {parseFloat(Math.floor(100*(1*userBalance.wallet+1*userBalance.unRealPnl))/100).toFixed(2)}</div>
            <div className="balance-price-middle"> USDT</div>
            </div>
          </div>
          <div style={{display:"flex", margin:"0", minWidth:"0px"}}>
            <div style={{width:"33%"}}>
                <div className="balance-header-total">{t('balance.walletbalance')}</div>
                <div  className="balanceBase" >
                    <div className="balance-price-middle"> {parseFloat(Math.floor(100*userBalance.wallet)/100).toFixed(2)}</div>
                    <div className="balance-price-small"> USDT</div>
                </div>
            </div>
            <div style={{width:"33%"}}>
            <div className="balance-header-total">{t('balance.availablebalance')}</div>
                <div  className="balanceBase" >
                    <div className="balance-price-middle"> {parseFloat(Math.floor(100*userBalance.available)/100).toFixed(2)}</div>
                    <div className="balance-price-small"> USDT</div>
                </div>
            </div>
            <div style={{width:"33%"}}>
            <div className="balance-header-total">{t('balance.unrealizedpnl')}</div>
                <div  className="balanceBase" >
                    <div className="balance-price-middle"> {parseFloat(Math.floor(100*userBalance.unRealPnl)/100).toFixed(2)}</div>
                    <div className="balance-price-small">  USDT</div>
                </div>
            </div>
          </div>
        </div>
          <div className="balancelist">
            <div className="balancelist-head"> 
              <div className={classIsActive('dewith')} onClick={()=> changeNowToggle('dewith')} >{t('balance.dwhistory.title')}
              </div>
              <div className={classIsActive('pnl')} onClick={()=> changeNowToggle('pnl')}>{t('balance.pnlhistory.title')}
              </div>
            </div>  
            <div style={{margin:"15px"}}>
              <div style={{display:"flex", flex:"1 1 0%", marginTop:"15px"}}>
                {view === 'table'? 
                  <div style={{display:"flex", flex:"1 1 0%"}}>
                    <button style={{marginRight:"3px"}}className={ classIsPeriodActive('day')} onClick={()=> changePeriod('day')}>1D</button>
                    <button style={{marginRight:"3px"}} className={ classIsPeriodActive('week')} onClick={()=> changePeriod('week')}>1W</button>
                    <button style={{marginRight:"3px"}} className={ classIsPeriodActive('month')} onClick={()=> changePeriod('month')}>1M</button>
                    <button style={{marginRight:"3px"}} className={ classIsPeriodActive('3month')} onClick={()=> changePeriod('3month')}>3M</button>
                    <button style={{marginRight:"3px"}} className={ classIsPeriodActive('all')} onClick={()=> changePeriod('all')}>ALL</button>
                  </div>
                : 
                  <div style={{display:"flex", flex:"1 1 0%" , lineHeight:"29px", alignItems:"center", minHeight:"36px"}}>
                    {calMin<calNow?  <RiArrowLeftSLine style={{cursor:"pointer"}}onClick={()=> setNowMothAgo(calNow)} size={27}/> :<div style={{minWidth:"27px", height:"auto"}}></div> }
                   
                   <input className="calperiod calend" disabled={true} value={getNowDate()} />
                   {calMax>calNow ?  <RiArrowRightSLine style={{cursor:"pointer"}} onClick={()=> setNowMonthNext(calNow)}size={27}/>: <></>}
                   
                  </div>
                }
               
                <div style={{display:"flex"}}>
                  <button className={'noneborderright '+ classIsViewActive('table')} onClick={()=> changeView('table')}><BsCardList size={20}/></button>
                  <button style={{marginRight:"3px"}} className={'noneborderleft '+ classIsViewActive('calendar')} onClick={()=> changeView('calendar')}><RiCalendar2Line size={20}/></button>
                </div>
              </div>
              {nowToggle ==='dewith'? 
              <DeWithList
                view={view}
                period={period}
                startPeriod={startPeriod}
                startDate={startDate}
                endDate={endDate}
                calNow={calNow}
              /> : nowToggle === 'pnl' ? 
              <PnlList
                view={view}
                period={period}
                startPeriod={startPeriod}
                startDate={startDate}
                endDate={endDate}
                calNow={calNow}
              /> : <></>
              }
            </div>
          </div>
      </Card>
      :
      <></>
      : 
      isApi === 'none' || isApi === 'invalid' ?
              <NotApi
              isApi={isApi}
              />
              
      :<></>}
    </Container>
  );
}
export default Balancet;