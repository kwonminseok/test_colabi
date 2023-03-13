import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import { Card } from '../../components';
import 'react-confirm-alert/src/react-confirm-alert.css';
import TextInput from '../../components/InputBox/component/TextInput'
import LabelText from '../../components/InputBox/component/LabelText'
import ErrText from '../../components/InputBox/component/ErrText'
import SubBtn from '../../components/InputBox/component/SubBtn'
import NickInput from './component/NickInput';
import TermsInput from './component/TermsInput';
import encryption from '../../encryption';
const Register3 = (props) =>{
    const { t } = useTranslation();
    const logstatus = useSelector(state => state.user.logstatus)
    const [isNick, setIsNick]= useState('');
    const dispatch = useDispatch();
    const _isMounted = useRef(true);
    const {newNickName, checkNickName} = useSelector(state => ({
        newNickName: state.auth.getIn(['register', 'form','newNickName']),
        checkNickName: state.auth.getIn(['register', 'form','checkNickName']),
    }))

    useEffect(()=>{
        dispatch({
            type:'user/USER_AUTH_TOTAL',
            payload:'register'
        })

        document.title = `${t('accountregister.title')} | Bitcolabi`;

        return () => {
          _isMounted.current = false;
          dispatch({
               type:"user/INITIALIZE_FORM",
               payload:'register'
          })
        };
    },[])

    useEffect(()=>{
        if(logstatus ==='LOGIN'){
         document.location.href = '/trade/binance/BTCUSDT';
        }
     },[logstatus])

    const validationEmail = value => {
        let error;
        if (!value) {
          error = t('login.notemail');
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          error = t('login.invaildemail');
        }
        return error;
    };

    const validationPassword = value =>{
        let error;
        if(!value){
            error =t('accountregister.notpassword')
        }else if(!/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,30}$/.test(value)){
            error = t('accountregister.invalidpassword')
        }
        return error;
    }



    const checkNick = async() =>{
        if(newNickName !== '' && newNickName.length>=3){
          axios.post('/api/v2/traders/nickname', { NickName: newNickName })
          .then(response =>{
            if(_isMounted.current){
            if(response.data.status === 'SUCCESS'){
              if(response.data.message === 'This Nickname is available'){
                setIsNick('valid')
                dispatch({
                  type:"api/CHANGE_INPUTS",
                  payload:{
                    name:'checkNickName',
                    value: newNickName,
                    form:'register'
                  }
                })
              }else if( response.data.meessage === 'This Nickname is duplicated'){
                setIsNick('invalid')
                dispatch({
                  type:"api/CHANGE_INPUTS",
                  payload:{
                    name:'checkNickName',
                    value:'',
                    form:'register'
                  }
                })
              }
            }else if(response.data.status === 'FAILURE'){
    
            }else{
    
            }
          }
          })
          .catch(e =>{
    
          })
        }else{
          setIsNick('notenough')
          dispatch({
            type:"api/CHANGE_INPUTS",
            payload:{
              name:'checkNickName',
              value:'',
              form:'register'
            }
          })
        }
    }

    const handleChangeNick = (e) =>{
      const {name, value} = e.target
        dispatch({
            type:"api/CHANGE_INPUTS",
            payload:{
              name,
              value,
              form:'register'
            }
        })
    }

  



     return(
        <div className='orderbookorder' style={{minHeight:"calc(100vh - 178px)", marginBottom:"20px"}}>
            <Card className="log-card" style={{marginTop:"38px"}}>
                <div className='regiregsnklsku'> 
                  {t('accountregister.title')}
                  
                </div>
                <Formik initialValues={{ email: "", password: "", checkTerms: true }} onSubmit={async (data,{ setSubmitting,setFieldError }) => {
                    setSubmitting(true)
                    if(isNick === 'valid'){
                      if(checkNickName !== newNickName){
                        setIsNick('notcheck')
                      }else if(data.checkTerms){
                        const {email, password} = data;
                        let a = email.indexOf("@");
                        let name1 = email.substring(0,a);
                        let name2 = email.substring(a+1).toLowerCase();
                        let name3 = name1+"@"+name2;
                        await axios.post('/api/v2/traders/register', { Id: name3, Pw: encryption.Encrypt(password), NickName: checkNickName })
                        .then(response => {
                          if(_isMounted.current){
                            if(response.data.status ==="SUCCESS"){
                                if (response.data.message === 'Duplicated Email') {
                                    setFieldError('email', t('accountregister.existemail'))
                                  } else if (response.data.message === "Successfully Signed up") {
                                    props.history.push(
                                      `/register-verification/email?email=${name3}`,
                                    );
                                  } 
                            }else if(response.data.status ==="FAILURE"){
  
                            }
                          }
                          })
                          .catch(e => {
                          
                          })
                      }
                    }else if(isNick ===''){
                      setIsNick('notcheck')
                    } 
                    setSubmitting(false)
                }}>
                {
                    ({values, errors, touched, handleChange, handleSubmit, isSubmitting}) =>(
                        <Form autoComplete='off' onSubmit={handleSubmit}>
                            <div className="log-box">
                                <LabelText
                                    title={t('accountregister.email')}
                                    required={true}
                                />
                                <Field
                                    as={TextInput}
                                    name='email'
                                    inputType="text"
                                    value={values.email}
                                    errors={errors.email}
                                    onChange={handleChange}
                                    touched={touched.email}
                                    validate={validationEmail}
                                />
                                <ErrText errors={errors.email} touched={touched.email}/>
                            </div>
                            <div className="log-box">
                                <LabelText
                                    title={t('accountregister.password')}
                                    required={true}
                                />
                                <Field
                                    as={TextInput}
                                    name='password'
                                    inputType="password"
                                    value={values.password}
                                    errors={errors.password}
                                    onChange={handleChange}
                                    touched={touched.password}
                                    validate={validationPassword}
                                />
                                <ErrText errors={errors.password} touched={touched.password}/>
                            </div>
                            <div className="log-box" style={{marginBottom:"0"}}>
                                <NickInput
                                    title={t('accountregister.nickname')}
                                    value={newNickName}
                                    name='newNickName'
                                    handleChange={handleChangeNick}
                                    checkNick={checkNick}
                                    checkName={t('accountregister.check')}
                                    isNick={isNick}
                                    t={t}
                                />
                            </div>
                            <TermsInput
                                id={'register-term-check'}
                                isCheck={values.checkTerms}
                                handleChange={handleChange}
                                name="checkTerms"
                                label= {t('accountregister.checkterm')}
                                terms={t('accountregister.bitterms')}
                            />
                             <ErrText errors={errors.checkTerms} touched={touched.checkTerms}/>
                            <SubBtn
                                title= {t('accountregister.title')}
                                disabled={isSubmitting}
                                id="click_register"
                            />
                        </Form>
                    )
                }
                </Formik>
                <div style={{padding: '1rem 0px 0px'}}>{t('login.notyetbinance')}</div>
                <div className="futureslinked" style={{marginTop:"10px"}}>
                    <a href='https://accounts.binance.com/en/register?ref=&source=futures' style={{color:"#58b589"}} target="_blank">
                      {t('setting.freemember')}  
                    </a>
                </div>
            </Card>
        </div>
     )


}

export default Register3;