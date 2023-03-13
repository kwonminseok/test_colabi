import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux'
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import encryption from '../../encryption';
import { Card } from '../../components';
import TextInput from '../../components/InputBox/component/TextInput';
import LabelText from '../../components/InputBox/component/LabelText';
import ErrText from '../../components/InputBox/component/ErrText';
import LinkText from '../../components/InputBox/component/LinkText';
import SubBtn from './component/SubBtn'
const Login4 = () => {
  const { t } = useTranslation();
  const logstatus = useSelector(state => state.user.logstatus)
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch({
        type:'user/USER_AUTH_TOTAL',
        payload:'login'
    })

    document.title = `${t('login.title')} | Bitcolabi`;

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
      error = t('login.notpassword')
    }
    return error;
  }

  return (
    <div className='orderbookorder' style={{ minHeight: 'calc(100vh - 178px)' }}>
      <Card className='log-card' style={{ marginTop: '38px' }}>
        <div className='logregsnklsku'> {t('login.title')}</div>
        <Formik initialValues={{ email: "", password: "" }} onSubmit={async (data,{ setSubmitting,setFieldError }) => {
            setSubmitting(true)
            const {email, password} = data;
            let a = email.indexOf('@');
            let name1 = email.substring(0, a);
            let name2 = email.substring(a + 1).toLowerCase();
            const name3 = name1 + '@' + name2;
                await axios.post('/api/v2/login', { Id: name3, Pw: encryption.Encrypt(password)})
                .then(response =>{
                  console.log(response)
                    if(response.data.status === 'SUCCESS'){
                        switch (response.data.message) {
                            case 'Invalid Email or Password': {
                                setFieldError('password', t('login.invalidpassword'))
                                break;
                            }
                            case 'Successfully logged in': {
                              document.location.href = '/trade/binance/BTCUSDT';
                              break;
                            }
                            case 'Need Verification': {
                              document.location.href = `/register-verification/email?email=${name3}`;
                              break;
                            }
                            default:{
                              break;
                            }
                          }
                    }else if(response.data.statuts === 'FAILURE'){
                        //server Error
                    }else{
                        //dont know Error
                    }
                })
                .catch(e=>{
                  //dont know Error
                })
            
            setSubmitting(false)
        }}>
        {
          ({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
                <div className="log-box">
                    <LabelText
                        title={t('accountregister.email')}
                        required={false}
                    />
                    <Field
                        as={TextInput}
                        autoComplete='email-login email'
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
                        required={false}
                    />
                    <Field
                        as={TextInput}
                        autoComplete='email-login password'
                        name='password'
                        inputType="password"
                        value={values.password}
                        touched={touched.password}
                        errors={errors.password}
                        onChange={handleChange}
                        validate={validationPassword}
                    />
                    <ErrText errors={errors.password} touched={touched.password}/>
                </div>
                <SubBtn 
                    title= {t('login.title')}
                    disabled={isSubmitting}
                    id="click_login"
                />
            </Form>
          )
        }
        </Formik>
        <div  className="flex" style={{padding:"0px 8px", fontSize:"13px"}}>
          <LinkText
            title={t('login.forget')}
            color="#111"
            href="/reset-password"
            classes=""
          />
          <LinkText
            title= {t('login.register')}
            color='#22bf67'
            href='/register'
            classes="login-regi"
          />
        </div>
        <div style={{padding: '1rem 0px 0px'}}>{t('login.notyetbinance')}</div>
                <div className="futureslinked" style={{marginTop:"10px"}}>
                    <a href='https://accounts.binance.com/en/register?ref=&source=futures' style={{color:"#58b589"}} target="_blank">
                      {t('setting.freemember')}  
                    </a>
        </div>
      </Card>
    </div>
  );
};

export default Login4;
