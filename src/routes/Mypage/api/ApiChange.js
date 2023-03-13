import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Alert } from 'reactstrap';
import PulseLoader from "react-spinners/PulseLoader";
import { ToastContainer, toast } from 'react-toastify';
import {Card} from '../../../components';
import { contentInfo2, contentErrornoTitle } from '../../../components/Notification/Notification';
import encryption from '../../../encryption';
import TextInput from '../../../components/InputBox/component/TextInput'
import LabelText from '../../../components/InputBox/component/LabelText'
import SubBtn from '../../../components/InputBox/component/SubBtn'

const Binance = require('node-binance-api');
const binance = new Binance().options({
  useServerTime: true,
});

const ApiChnage= () =>{
  const { t } = useTranslation();
  const [check,setCheck] = useState(false)
  const [disable,setDisable] = useState(true)
  const [isCheck, setIsCheck] = useState('')
  const dispatch = useDispatch();
  const logstatus = useSelector(state => state.user.logstatus)
  const newApi = useSelector(state => state. auth.getIn(['api', 'form','newApi']))
  const newSecret = useSelector(state => state. auth.getIn(['api', 'form','newSecret']))
  useEffect(()=>{
    dispatch({
        type:'user/USER_AUTH_TOTAL',
        payload:'apichange'
    })

    document.title = `${t('apich.title')} | Bitcolabi`;
  },[])

  useEffect(()=>{
    if(logstatus ==='LOGOUT'){
      document.location.href = '/';
    }
  },[logstatus])

  useEffect(() =>{
    if(newApi.length===64 && newSecret.length === 64){
      checkApi()
    }
  },[newApi,newSecret])

  const handleChange = (e) =>{
    const {name, value} = e.target
    if(/^[A-Za-z0-9]*$/.test(value)){
      dispatch({
        type:"api/CHANGE_INPUTS",
        payload:{
          name,
          value,
          form:'api'
        }
      })
    }
  }
  const handleSubmit = async(e) =>{
    e.preventDefault();
    setDisable(true)
    if(isCheck === 'cantTrade' || isCheck === 'valid'){
      const isTrial = await binance.futuresGetIfNew();
      if(isTrial.code === undefined){
        var tag;
        if(isTrial.ifNewUser && isTrial.rebateWorking){
          tag = '/api/v2/keyfree'
         
        }else{
          //no free
          tag = '/api/v2/keybasic'
         
        }
        ApiChnage(tag)
      }
      console.log(isTrial)
    }
    setDisable(false)

  }

  const ApiChnage = async(tag) =>{
    axios.post(tag,{Ia: encryption.Encrypt(newApi), Ts: encryption.Encrypt(newSecret)})
    .then(response =>{
      
      if(response.data.status === 'SUCCESS'){
        if(response.data.message === "Successfully be Free User"){
          //change completed
          toast.success(contentInfo2(t('apich.changeok')))
          setTimeout(onClickCancel, 2200);
        }else if(response.data.message ==="Successfully Updated API"){
          toast.success(contentInfo2(t('apich.changeok')))
          setTimeout(onClickCancel, 2200);
        }else if(response.data.message === "No Datas"){
          //미입력
          toast.error(contentErrornoTitle(t('apich.nodata')))
          clearApi()
        }
      }else if(response.data.status === "FAILURE"){

      }else{

      }
    })
    .catch(e =>{

    })
  }


  const checkApi = async() => {
      binance.options({
        APIKEY: newApi,
        APISECRET: newSecret,
        useServerTime: true,
      });
      setCheck(true)
      const account = await binance.futuresAccount();
      if(account.code === -2014 || account.code === -2015 || account.code === -1022){
        setTimeout(
          setIsCheck('invalid'),2000
        )
      }else if(account.code === -1021){
          //Time 머시기 
      }else if(account.canTrade === undefined){
        setIsCheck('cantTrade')
        // setCheck(true)
        setDisable(false)
      }else if(account.canTrade !== undefined){
        setIsCheck('valid')
        // setCheck(true)
        setDisable(false)
      }else{
        // i don't know
      }
      setCheck(false)
  }

  const clearApi = () =>{
    dispatch({
      type:"api/CHANGE_INPUTS",
      payload:{
        name:'newApi',
        value:"",
        form:'api'
      }
    })
    dispatch({
      type:"api/CHANGE_INPUTS",
      payload:{
        name:'newSecret',
        value:"",
        form:'api'
      }
    })
    setIsCheck('')
    setDisable(true)
  }

  const generateAlert = () =>{
    switch(isCheck){
      case 'invalid':{
        return (
          <Alert color='danger'>
            <i className='fa fa-times-circle mr-1 alert-icon'></i>
            <span style={{ marginLeft: '40px' }}>
              {t('apich.invalid')}
            </span>
          </Alert>
        )
      }
      case 'cantTrade':{
        return (
          <Alert color='success'>
            <i className='fa fa-check-circle mr-1 alert-icon'></i>
            <span style={{ marginLeft: '40px' }}>
              {t('apich.valid')}
            </span>
          </Alert>
        )
      }
      case 'valid': {
        return (
          <Alert color='success'>
            <i className='fa fa-check-circle mr-1 alert-icon'></i>
            <span style={{ marginLeft: '40px' }}>
              {t('apich.valid')}
            </span>
          </Alert>
        )
      }
      default : return <></>
    }
  }

  const  onClickCancel = () => {
    document.location.href = '/mypage/account';
  };

  return(
    <>
    <div className='orderbookorder' style={{minHeight:"calc(100vh - 200px)"}}>
      <Card className="pass-card" >
        <div className='regsnklsku'>
          {t('apich.title')} 
          <div className="futureslinked" style={{marginTop:"10px"}}>
            <a href='https://accounts.binance.com/en/register?ref=&source=futures' style={{color:"#58b589"}} target="_blank">
              {t('setting.freemember')}  
            </a>
            <div style={{fontWeight:"400", marginTop:"5px"}}> {t('login.registerbinance')}</div>
          </div>
        
        </div>
        
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="log-box">
            <LabelText
              title= 'New Api Key'
              required={false}
            />
            <TextInput
              name='newApi'
              inputType="text"
              value={newApi}
              onChange={handleChange}
              disabled={isCheck==='valid'|| isCheck ==='cantTrade'}
            />
          </div>
          <div style={{zIndex:"99", minHeight:"22px"}}>
            {check? <PulseLoader size={11}color="#1f435f"/> : " "}
          </div>
          <div className="log-box">
            <LabelText
              title= 'New Secret Key'
              required={false}
            />
            <TextInput
              name='newSecret'
              inputType="text"
              value={newSecret}
              onChange={handleChange}
              disabled={isCheck==='valid'|| isCheck ==='cantTrade'}
            />
          </div>
          <div className='regfield'>
            {generateAlert()}
          </div>
          <SubBtn
            title= {t('apich.check')}
            disabled={disable}
            id="click_change_api"
          />
        </form>
      </Card>
    </div>
    <ToastContainer
      position='bottom-right'
      autoClose={2000}
      draggable={false}
      hideProgressBar={true}
    />
    </>
  )
}

export default ApiChnage;
