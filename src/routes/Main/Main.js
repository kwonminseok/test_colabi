import React, {useEffect} from 'react';
import Landing from './component/Landing';
import Notice from './component/Notice';
import ContactList from './component/ContactList'
import Exp from './component/Exp';
import { useTranslation } from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import orderbook from '../../orderbook.png'
import order from '../../order.png'
import balance from '../../balance.png'



const Main = () =>{
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {api, noticeMain, mbc, logstatus} = useSelector(state =>({
    api: state.api,
    noticeMain: state.support.nownoticemain,
    mbc: state.user.mbc,
    logstatus: state.user.logstatus
  }))
  
  useEffect(() =>{
    document.title = `Bitcolabi | ${t('main.title')}`;
    window.addEventListener('resize', updateWindowDimensions)
    dispatch({
      type:"support/GET_NOTICE_MAIN"
    })
    dispatch({
      type:'api/GET_HOME_KLINE_DATA'
    })
    dispatch({
      type:'user/USER_AUTH_TOTAL',
      payload:'main'
    })
    updateWindowDimensions()

    function updateWindowDimensions(){
      if(mbc.check ==='not'){
        if(window.innerWidth>=1280){
          //lg
          dispatchMbc('done','lg')
        }else if(window.innerWidth>=768){
          //md
          dispatchMbc('done','md')
        }else {
          dispatchMbc('done','sm')
          //sm
        }
      }else if(window.innerWidth<768 && mbc.mb !== 'sm'){
        dispatchMbc('done','sm')
      }else if(window.innerWidth>=768 &&window.innerWidth<1280 && mbc.mb !== 'md'){
        dispatchMbc('done','md')
      }else if(window.innerWidth>1280 && mbc.mb !=='lg'){
        dispatchMbc('done','lg')
      }
    }
    return () =>window.removeEventListener('resize', updateWindowDimensions)

  },[])

  const dispatchMbc = (check, mb) =>{
    dispatch({
      type:"user/SET_MBC",
      payload:{
        check,
        mb
      }
    })
  }

  return (
    <div className="mainv-ew">
      <Landing 
      t={t}
      islog={logstatus}/>
      
      <Notice
        noticeMain={noticeMain}
        t={t}
      />
     
      <div className="main-chart">
        {api.isReady ?
       <ContactList
       api={api}
       mb={mbc.mb}/>:<></>  
      }
      </div>
      <div className="main-infos">
        <Exp
          title={t('main.info.firstT')}
          sub={t('main.info.firstS')}
          content={[t('main.info.firstC'),t('main.info.firstCC')]}
          img={orderbook}
          mb={mbc.mb}
        />
        <Exp
          title={t('main.info.secondT')}
          sub={t('main.info.secondS')}
          content={[t('main.info.secondC'),t('main.info.secondCC')]}
          img={order}
          mb={mbc.mb}
        />
        <Exp
          title={t('main.info.thirdT')}
          sub={t('main.info.thirdS')}
          content={[t('main.info.thirdC'),t('main.info.thirdCC')]}
          img={balance}
          mb={mbc.mb}
        />
      </div>

    </div>
  );
  

}
export default Main;

