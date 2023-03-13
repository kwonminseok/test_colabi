import React, {useState, useEffect, useCallback} from 'react'
import { useTranslation } from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios';
import { Card } from '../../components';
import { confirmAlert } from 'react-confirm-alert';
import { Formik, Field, Form } from 'formik';
import TextInput from '../../components/InputBox/component/TextInput'
import LabelText from '../../components/InputBox/component/LabelText'
import ErrText from '../../components/InputBox/component/ErrText'
import SubBtn from '../../components/InputBox/component/SubBtn'
const ForgetPassword = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [resetEmail, setResetEmail]= useState('')
    const logstatus = useSelector(state => state.user.logstatus)

    useEffect(()=>{
        dispatch({
            type:'user/USER_AUTH_TOTAL',
            payload:'forget'
        })
        document.title = ` ${t('forgetpass.title')} | Bitcolabi`;
    },[dispatch,t])

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


    return(
            <div className='orderbookorder' style={{minHeight:"calc(100vh - 200px)"}}>
                <Card className="pass-card" style={{marginTop:"38px"}}>
                <div className='regsnklsku'>{t('forgetpass.title')}</div>
                <Formik initialValues={{ email: ""}} onSubmit={async (data,{ setSubmitting,setFieldError }) => {
                    setSubmitting(true)
                    const {email} = data;
                    let a = email.indexOf("@");
                    let name1 = email.substring(0,a);
                    let name2 = email.substring(a+1).toLowerCase();
                    const name3 = name1+"@"+name2;
                    await axios.post('/api/v2/traders/email/pw', {Id: name3})
                    .then(response => {
                        if (response.data.status === 'SUCCESS'){
                            confirmAlert({
                                title: t('forgetpass.temporary'),
                                message: t('forgetpass.temcom'),
                                buttons: [
                                {
                                    label: 'Yes',
                                    onClick: () => document.location.href = '/'
                                }
                                ]
                            });
                        }else {
                            document.location.href = '/';
                        }
                    })
                    .catch(e=>{
                        document.location.href = '/';
                    })
                    setSubmitting(false)
                }}>
                {
                      ({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="log-box">
                            <LabelText
                                title={t('forgetpass.email')}
                                required={false}
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
                        <SubBtn 
                            title= {t('passwordch.check')}
                            disabled={isSubmitting}
                            id="click_send_email"
                        />

                    </Form>
                
                )}
                 </Formik>
                </Card>
            </div>
    )
}
export default ForgetPassword;    