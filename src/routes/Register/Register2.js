import React, {useState, useRef, useEffect,useCallback} from 'react'
import {useSelector, useDispatch,shallowEqual} from 'react-redux'
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import PulseLoader from "react-spinners/PulseLoader";
import { Card,} from '../../components';
import {Alert} from 'reactstrap'
import ClassInput from './component/ClassInput';
import ApiInput from './component/ApiInput';
import NickInput from './component/NickInput';
import TermsInput from './component/TermsInput';
import encryption from '../../encryption';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
const Binance = require('node-binance-api');
const binance = new Binance().options({
  useServerTime: true,
});


const Register2 = (props) =>{
    const emailInput = useRef()
    const pwInput = useRef()
    const NicknameInput = useRef()
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const logstatus = useSelector(state => state.user.logstatus)
    const {newEmail,newPassword,newNickName,api,secret} = useSelector(state => ({
        newEmail: state.auth.getIn(['register', 'form','newEmail']),
        newPassword: state.auth.getIn(['register', 'form','newPassword']),
        newNickName: state.auth.getIn(['register', 'form','newNickName']),
        api: state.auth.getIn(['register', 'form','api']),
        secret: state.auth.getIn(['register', 'form','secret'])
    }),shallowEqual)

    const [inputs, setInputs] = useState({
        isApi: "",
        isEmail: "",
        isPw: "",
        isNick: "",
        checkNick: "",
        checkLoding: false,
        disabled: false,
        checkTerms: true,
    })
    const { isApi, isEmail, isPw, isNick, checkNick, checkLoding, disabled,checkTerms} = inputs;

    useEffect(()=>{
        dispatch({
            type:'user/USER_AUTH_TOTAL',
            payload:'register'
        })
        document.title = `${t('accountregister.title')} | Bitcolabi`;

        return () => {
           dispatch({
               type:"user/INITIALIZE_FORM",
               payload:'register'
           })
          };
    },[dispatch,t])

    useEffect(()=>{
       if(logstatus ==='LOGIN'){
        document.location.href = '/trade/binance/BTCUSDT';
       }
    },[logstatus])

    useEffect(()=>{
        if(api.length === 64 &&secret.length ===64 ){
            setInputs({
                ...inputs,
                disabled:true,
                checkLoding:true
            })
            checkApi()
        }
     },[api,secret])

    const handleChange = (e) => {
         const { name, value } = e.target;
         var pa;
         switch(name){
            case 'newPassword':{
                if(value.length<23){
                    dispatch({
                        type:"api/CHANGE_INPUTS",
                        payload:{
                            name,
                            value,
                            form: 'register'
                        }
                    })
                }else{
                    pa = value.substring(0,22)
                    dispatch({
                        type:"api/CHANGE_INPUTS",
                        payload:{
                            name,
                            pa,
                            form: 'register'
                        }
                    })
                }
                break;
            }
            case 'newNickName':{
                if(checkNotSc(value)){
                    if(value.length<21){
                        dispatch({
                            type:"api/CHANGE_INPUTS",
                            payload:{
                                name,
                                value,
                                form: 'register'
                            }
                        })
                    }else{
                        pa = value.substring(0,20)
                        dispatch({
                            type:"api/CHANGE_INPUTS",
                            payload:{
                                name,
                                pa,
                                form: 'register'
                            }
                        })
                    }
                }
                break;
            }
            case 'api':{
                if(checkOnlyEngNum(value)){
                    if(value.length<=64){
                    
                        dispatch({
                            type:"api/CHANGE_INPUTS",
                            payload:{
                                name,
                                value,
                                form: 'register'
                            }
                        })
                    }else{
                        pa = value.substring(0,64)
                        dispatch({
                            type:"api/CHANGE_INPUTS",
                            payload:{
                                name,
                                pa,
                                form: 'register'
                            }
                        })
                    }   
                }
                break;
            }
            case 'secret':{
                if(checkOnlyEngNum(value)){
                    if(value.length<=64){
                    
                        dispatch({
                            type:"api/CHANGE_INPUTS",
                            payload:{
                                name,
                                value,
                                form: 'register'
                            }
                        })
                    }else{
                        pa = value.substring(0,64)
                        dispatch({
                            type:"api/CHANGE_INPUTS",
                            payload:{
                                name,
                                pa,
                                form: 'register'
                            }
                        })
                    }   
                }
                break;
            }
            default:{
                dispatch({
                    type:"api/CHANGE_INPUTS",
                    payload:{
                        name,
                        value,
                        form: 'register'
                    }
                })
            }
         }
    }

    const checkApi = () =>{
        binance.options({
            APIKEY: api,
            APISECRET: secret,
            useServerTime: true,
          });
          callAcount()
    }

    const checkTrial = async()=>{
        const isTrial = await binance.futuresGetIfNew();
        if(isTrial.code === undefined){
            if(isTrial.ifNewUser && isTrial.rebateWorking){
                
                checkTagApi();
            }else{
                confirmAlert({
                    title: 'Register',
                    message: t('accountregister.cantapi'),
                    buttons: [
                      {
                        label: 'Yes',
                        onClick: () => createNewNotrial()
                      },
                      {
                        label: 'No',
                        onClick: () => clearApi()
                      }
                    ]
                });
            }
        }else{
           
            setInputs({
                ...inputs,
                disabled:false
            })
        }
    }

    const callAcount = async() =>{
        const account = await binance.futuresAccount();
        if(account.code === -2014 || account.code === -2015 || account.code === -1022){
            setTimeout(
                setInputs({
                    ...inputs,
                    isApi: 'invalid',
                    checkLoding:false,
                    disabled:false
                }),1000
            )
          }else if(account.code === -1021){
            setTimeout(
                setInputs({
                    ...inputs,
                    checkLoding:false,
                    disabled:false
                }),1000
            )
          }else if(account.canTrade === undefined){
            setTimeout(
                setInputs({
                    ...inputs,
                    isApi: 'cantTrade',
                    checkLoding:false,
                    disabled:false
                }),1000
            )
            // checkTrial()
          }else if(account.canTrade !== undefined){
            setTimeout(
                setInputs({
                    ...inputs,
                    isApi: 'valid',
                    checkLoding:false,
                    disabled:false
                }),1000
            )
            // checkTrial()
          }else{
            setInputs({
                ...inputs,
                disabled:false
            })
           
          }
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        setInputs({
            ...inputs,
            disabled:true
        })
        if(checkTerms){
            if(isEmail !== 'valid' && newEmail ===''){
                setInputs({
                    ...inputs,
                    disabled:false,
                    isEmail:'notEnter'
                })
                emailInput.current.focus();
            }else if(!newPassword.length){
                setInputs({
                    ...inputs,
                    disabled:false,
                    isPw:'notEnter'
                })
                pwInput.current.focus();
            }else if(isPw !== 'valid'){
                setInputs({
                    ...inputs,
                    disabled:false,
                })
                pwInput.current.focus();
            }else if(isNick !== 'valid' || checkNick !== newNickName){
                setInputs({
                    ...inputs,
                    disabled:false,
                    isNick:'notcheck'
                })
                NicknameInput.current.focus();
            }else{
            if(isApi === 'valid' || isApi === 'cantTrade'){
                checkTrial();
            }else{
                createNewAccountNoApi();
            }
            
        } 
        }else{
            setInputs({
                ...inputs,
                disabled:false
            })
        }
    }

    const checkTagApi = async() =>{
        await axios.post('/api/v2/traders/key', {Ia: encryption.Encrypt(api),Ts: encryption.Encrypt(secret)})
        .then(response =>{
            if(response.data.status ==="SUCCESS"){
                if(response.data.message === "Successfully Checked API"){
                    createNewAccountApi()
                }else if(response.data.message === "Duplicated API User"){
                    confirmAlert({
                        title: 'Register',
                        message: t('accountregister.apialready'),
                        buttons: [
                          {
                            label: 'Yes',
                            onClick: () => createNewAccountApi()
                          },
                          {
                            label: 'No',
                            onClick: () => clearApi()
                          }
                        ]
                    });
                }
            }else if(response.data.status==="FAILURE"){
                clearApi()
            }else{
                clearApi()
            }

            
        })
        .catch(e=>{
            clearApi()
        })
    }

    const clearApi = () =>{
        dispatch({
            type:"api/CHANGE_INPUTS",
            payload:{
                name:"api",
                value:"",
                form: 'register'
            }
        })
        dispatch({
            type:"api/CHANGE_INPUTS",
            payload:{
                name:"secret",
                value:"",
                form: 'register'
            }
        })
        setInputs({
            ...inputs,
            isApi:'',
            disabled:false
        })
    }

    const createNewAccountNoApi = async() => {
        let a = newEmail.indexOf("@");
        let name1 = newEmail.substring(0,a);
        let name2 = newEmail.substring(a+1).toLowerCase();
        let name3 = name1+"@"+name2;
        await axios.post('/api/v2/traders/register', { Id: name3, Pw: encryption.Encrypt(newPassword), NickName: newNickName })
        .then(response => {
            if(response.data.status ==="SUCCESS"){
                if (response.data.message === 'Duplicated Email') {
                      setInputs({
                          ...inputs,
                          disabled:false,
                          isEmail:'already'
                      })
                    emailInput.current.focus();
                  } else if (response.data.message === "Successfully Signed up") {
                    props.history.push(
                      `/register-verification/email?email=${name3}`,
                    );
                  } 
            }else if(response.data.status ==="FAILURE"){
                setInputs({
                    ...inputs,
                    disabled:false,
                })
            }else{
                setInputs({
                    ...inputs,
                    disabled:false,
                })
            }
          })
          .catch(e => {
            setInputs({
                ...inputs,
                disabled:false,
            })
          })
    }

    const createNewAccountApi = async() => {
        let a = newEmail.indexOf("@");
        let name1 = newEmail.substring(0,a);
        let name2 = newEmail.substring(a+1).toLowerCase();
        let name3 = name1+"@"+name2;

        await axios.post('/api/v2/traders/register', {Id: name3,Pw: encryption.Encrypt(newPassword),NickName: newNickName,Ia: encryption.Encrypt(api),Ts: encryption.Encrypt(secret)})
        .then(response => {
            if(response.data.status ==="SUCCESS"){
                if (response.data.message === 'Duplicated Email') {
   
                      setInputs({
                          ...inputs,
                          disabled:false,
                          isEmail:'already'
                      })
                    emailInput.current.focus();
                  } else if (response.data.message === 'Successfully Signed up') {
                    props.history.push(
                      `/register-verification/email?email=${name3}`,
                    );
                  }
            }else if(response.data.status ==="FAILURE"){
                setInputs({
                    ...inputs,
                    disabled:false,
                })
            } else {
                setInputs({
                    ...inputs,
                    disabled:false,
                })
            }
          })
          .catch(e => {
            setInputs({
                ...inputs,
                disabled:false,
            })
          })
    }

    const createNewNotrial = async() =>{
        let a = newEmail.indexOf("@");
        let name1 = newEmail.substring(0,a);
        let name2 = newEmail.substring(a+1).toLowerCase();
        let name3 = name1+"@"+name2;

        await axios.post('/api/v2/registernb', {Id: name3,Pw: encryption.Encrypt(newPassword),NickName: newNickName,Ia: encryption.Encrypt(api),Ts: encryption.Encrypt(secret)})
        .then(response => {
            if(response.data.status ==='SUCCESS'){
                if(response.data.message==="Successfully Signed up"){
                    props.history.push(
                        `/register-verification/email?email=${name3}`,
                    );
                }else if(response.data.message==="Duplicated Email"){
                    setInputs({
                        ...inputs,
                        disabled:false,
                        isEmail:'already'
                    })
                  emailInput.current.focus();
                }else if(response.data.message==="No Keys"){
                    setInputs({
                        ...inputs,
                        disabled:false,
                    })
                }
            }else if(response.data.status ==='FAILURE'){
                setInputs({
                    ...inputs,
                    disabled:false,
                })
            }else{
                setInputs({
                    ...inputs,
                    disabled:false,
                })
            }
          })
          .catch(e => {
            setInputs({
                ...inputs,
                disabled:false,
            })
          })
    }

    const checkNotSc = useCallback((nick) => {
        var re = /[~!@#$%^&*()_+|<>?:{}]/;
        return !re.test(nick)
    },[])

    const checkOnlyEngNum = useCallback((key) => {
        var re =  /^[A-Za-z0-9]*$/;
        return re.test(key)
      },[])

    const checkEmail = useCallback(() =>{
        var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if (regExp.test(newEmail) || newEmail === '') {
            if (newEmail === '') {
                setInputs({
                    ...inputs,
                    isEmail: ''
                });
            } else {
                setInputs({
                    ...inputs,
                    isEmail: 'valid'
                });
            }
          } else
            setInputs({
                ...inputs,
                isEmail: 'invalid'
            });
    },[inputs])

    const checkinvalidE =useCallback((is) => {
        if(is !== 'valid' && is !== ''){
          return 'invalidborder'
        }else {
          return ''
        }
    },[])

    const checkPw = useCallback(()=>{
        var num = newPassword.search(/[0-9]/g);
        var bigeng = newPassword.search(/[A-Z]/g);

    if (newPassword.length < 8 || newPassword.length > 20 || num<0 || bigeng<0) {
        setInputs({
            ...inputs,
            isPw: 'invalid'
        });
    }else {
        setInputs({
            ...inputs,
            isPw: 'valid'
        });
    }
    },[inputs])

    const chNick = useCallback(() => {
        if (newNickName !== '' && newNickName.length>=3) {
          axios
            .post('/api/v2/traders/nickname', { NickName: newNickName })
            .then(response => {
                if(response.data.status ==="SUCCESS"){
                    if (response.data.message === 'This Nickname is available') {
                        setInputs({
                            ...inputs,
                            isNick: 'valid',
                            checkNick:newNickName
                        });
                      } else if (response.data.message === 'This Nickname is duplicated') {
                        setInputs({
                            ...inputs,
                            isNick: 'invalid',
                        });
                      }
                }else if(response.data.status ==='FAILURE'){

                }else{
                    
                }
            })
            .catch(e => 
                setInputs({
                ...inputs,
                })
            );
        }else{
            setInputs({
                ...inputs,
                isNick: 'notenough',
            });
        }
      },[inputs])

    const generateDOMEmail = useCallback(() => {
        switch (isEmail) {
        case 'invalid': 
            return t('accountregister.invalidemail')
        case 'notEnter':
            return t('accountregister.notemail')
        case 'already':
            return t('accountregister.existemail')
        default:
            return '';
        }
    },[isEmail,t])    

    const generateDOMPw = useCallback(() => {
        switch (isPw) {
          case 'invalid':
            return t('accountregister.invalidpassword')
          case 'notEnter':
            return t('accountregister.notpassword')
          default:
            return '';
        }
      },[isPw,t])

    const handlecheckTermsChange = useCallback(() => {
        setInputs({
            ...inputs,
            checkTerms: !inputs.checkTerms
        });
    },[inputs])

    const   onClick = () => {
        window.open('https://www.binance.com/kr/register?ref=MFJCQSGD',"_blank")
      }

      const   onClick2 = () => {
        window.open('https://www.binance.com/kr/register?ref=""',"_blank")
      }

    return(
        <>
        {logstatus ==='LOGOUT'?
        <div className='orderbookorder' style={{minHeight:"calc(100vh - 178px)", marginBottom:"20px"}}>
              <Card className="log-card" style={{marginTop:"38px"}}>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className='regiregsnklsku'> {t('accountregister.title')}</div>
                    <div style={{ marginBottom: '20px' }}> {t('accountregister.subtitle')}</div>
                    <ClassInput
                        title={t('accountregister.email')}
                        value={newEmail}
                        type="text"
                        classes={checkinvalidE(isEmail)}
                        name='newEmail'
                        Inref={emailInput}
                        handleChange={handleChange}
                        isCheck={checkEmail}
                        valueValid={generateDOMEmail()}
                    />
                    <ClassInput
                        title={t('accountregister.password')}
                        value={newPassword}
                        type="password"
                        classes={checkinvalidE(isPw)}
                        name='newPassword'
                        Inref={pwInput}
                        handleChange={handleChange}
                        isCheck={checkPw}
                        valueValid={generateDOMPw()}
                    />
                    <NickInput
                        title={t('accountregister.nickname')}
                        value={newNickName}
                        name='newNickName'
                        handleChange={handleChange}
                        Inref={NicknameInput}
                        checkNick={chNick}
                        checkName={t('accountregister.check')}
                        isNick={isNick}
                        t={t}
                    />
                    <ApiInput
                        title='binance API KEY'
                        value={api}
                        name='api'
                        handleChange={handleChange}
                        isdisabled={isApi}
                    />
                    <div style={{zIndex:"99", minHeight:"22px"}}>
                        {checkLoding?   <PulseLoader size={11}
                        color="#1f435f"/> : " "}
                    </div>
                    <ApiInput
                        title='binance Secret KEY'
                        value={secret}
                        name='secret'
                        handleChange={handleChange}
                        isdisabled={isApi}
                    />
                    {isApi === 'cantTrade' || isApi === 'valid' ? (
                    <div className='regfield' style={{marginBottom:"0"}} >
                        <Alert color='success' style={{marginBottom:"0"}}>
                        <i className='fa fa-check-circle mr-1 alert-icon'></i>
                        <span style={{ marginLeft: '40px' }}>
                            {t('apicheck.available')}
                        </span>
                        </Alert>
                    </div>
                    ) :
                    isApi === 'invalid' ?
                    (
                    <div className='regfield' style={{marginBottom:"0"}}>
                        <Alert color='danger' style={{marginBottom:"0"}}>
                        <i className='fa fa-times-circle mr-1 alert-icon'></i>
                        <span style={{ marginLeft: '40px' }}>
                        {t('apicheck.not')}
                        </span>
                        </Alert>
                    </div>
                    ) :
                    (
                    <></>
                    )}
                    <TermsInput
                        id={'register-term-check'}
                        isCheck={checkTerms}
                        handleChange={handlecheckTermsChange}
                        label= {t('accountregister.checkterm')}
                        terms={t('accountregister.bitterms')}
                    />
                    <div className='regMGND2od' style={{paddingTop:"1rem"}}>
                        <button type='submit' className='chpwbutton' disabled={disabled}> {t('accountregister.createaccount')}</button>
                    </div>
                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <div className=''>
                        {t('accountregister.alreadyregistered')}
                        <a style={{ color: '#22bf67', marginLeft:"10px" }} href='/login'>
                            {t('accountregister.login')}
                        </a>
                        </div>
                        <div style={{padding: '1rem 1rem', paddingBottom:"15px"}}>{t('login.notyetbinance')}</div>
                        <div className="loing-banner">
                            <a href='https://accounts.binance.com/en/register?ref=&source=futures' target="_blank">
                                {t('login.trialbinance')}
                            </a>
                        </div>
                        <div className="loing-banner">
                            <a href='https://www.binance.com/en/futures/ref/48713395' target="_blank">
                                {t('login.registerbinance')}
                            </a>
                        </div>
                    </div>
                </form>
              </Card>
        </div>
        :<></>}
        </>
        
    )

    }

export default React.memo(Register2);
