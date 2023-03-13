import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../components';
import { FiUserCheck,FiAirplay } from "react-icons/fi";
import { RiOpenArmLine } from 'react-icons/ri';



const Setting = () =>{
  const { t } = useTranslation();
  const logstatus = useSelector(state => state.user.logstatus)
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch({
        type:'user/USER_AUTH_TOTAL',
        payload:'setting'
    })

  },[])

  useEffect(()=>{
    if(logstatus ==='LOGOUT'){
      console.log('hi')
      //document.location.href = '/';
    }
  },[logstatus])

  return(
    <>
      <div className='orderbookorder account-setting' style={{minHeight:"calc(100vh - 140px)"}}>
        <Card className="account-setting-card">
          <div>
            <RiOpenArmLine size={48} color= "#353333" />
          </div>
          <div className='mysetNLKD2ds'>{t('setting.welcome')}</div> 
          <div className='mysetCNifms'>{t('setting.subtitle')}</div>
              <a href='https://accounts.binance.com/en/register?ref=&source=futures' target="_blank" className='mysetCNFKLds'>
                    <div className='mysetDNdnjFG'>{t('setting.freemember')}</div>
              </a>
              <a href="/mypage/account" className='mysetCNFKLds'>
                <div className='mysetDNdnjFG'> {t('setting.api')}</div>
                <FiUserCheck style={{ flex: '1' }} size={30} />
              </a>

              <a href="/trade/binance/BTCUSDT" className='mysetCNFKLds'>
                <div className='mysetDNdnjFG'>{t('setting.trading')}</div>
                <FiAirplay style={{ flex: '1' }} size={30} />
              </a>
        </Card>
      </div>
    </>
  )

}

export default Setting;
