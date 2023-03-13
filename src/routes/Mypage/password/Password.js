import React, {useEffect} from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import {useSelector, useDispatch} from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import {Card} from '../../../components';
import {contentInfo2 } from '../../../components/Notification/Notification';
import encryption from '../../../encryption';
import TextInput from '../../../components/InputBox/component/TextInput'
import LabelText from '../../../components/InputBox/component/LabelText'
import ErrText from '../../../components/InputBox/component/ErrText'
import SubBtn from '../../../components/InputBox/component/SubBtn'
import * as yup from "yup";

const Password = () =>{
  const { t } = useTranslation();
  const logstatus = useSelector(state => state.user.logstatus)
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch({
        type:'user/USER_AUTH_TOTAL',
        payload:'password'
    })

    document.title = `${t('passwordch.title')} | Bitcolabi`;

},[])

  useEffect(()=>{
    if(logstatus ==='LOGOUT'){
      document.location.href = '/';
    }
  },[logstatus])


  const onClickCancel = () => {
        document.location.href = '/mypage/account';
  };

  const validationSchema = yup.object().shape({
    currentPassword: yup.string().required(t('passwordch.notenter')),
    newPassword: yup
      .string()
      .required(t('passwordch.newnot'))
      .matches(
        /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,30}$/,
        t('passwordch.ifvalid')
      ),
    confirmPassword: yup
      .string()
      .required(t('passwordch.checknew'))
      .when("newPassword", {
        is: newPassword => (newPassword && newPassword.length > 0 ? true : false),
        then: yup.string().oneOf([yup.ref("newPassword")], t('passwordch.checknew'))
      })
  });


  return(
    <>
    <div className='orderbookorder' style={{minHeight:"calc(100vh - 200px)"}}>
      <Card className="pass-card" style={{marginTop:"38px"}}>
        <div className='regsnklsku'>{t('passwordch.title')}</div>
          <Formik initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
           validationSchema={validationSchema}
           onSubmit={async (data,{ setSubmitting,setFieldError }) => {
             setSubmitting(true)
             const { currentPassword, confirmPassword }= data;
             await axios.post('/api/v2/pw', {CurrentPw: encryption.Encrypt(currentPassword), PostPw: encryption.Encrypt(confirmPassword)})
             .then( response => {
              if(response.data.status ==='SUCCESS'){
                if(response.data.message === "Successfully updated pw"){
                  toast.success(contentInfo2(t('passwordch.changepw')))
                  setTimeout(onClickCancel, 2200);
                }else if(response.data.message === "Invalid Password"){
                  setFieldError('currentPassword',t('passwordch.invalid'))
                }
              }else if(response.data.status === 'FAILURE'){
                  
              }
            })
            .catch(e =>{
            })       
            setSubmitting(false)
           }}>
              {
                ({values, errors, touched, handleChange, handleSubmit, isSubmitting}) =>(
                  <Form autoComplete='off' onSubmit={handleSubmit}>
                      <div className="log-box">
                          <LabelText
                            title= {t('passwordch.cupw')}
                            required={false}
                          />
                          <Field
                            as={TextInput}
                            name='currentPassword'
                            inputType="password"
                            value={values.currentPassword}
                            errors={errors.currentPassword}
                            onChange={handleChange}
                            touched={touched.currentPassword}
                          />
                          <ErrText errors={errors.currentPassword} touched={touched.currentPassword}/>
                      </div>
                      <div className="log-box">
                        <LabelText
                          title= {t('passwordch.newpw')}
                          required={false}
                        />
                        <Field
                          as={TextInput}
                          name='newPassword'
                          inputType="password"
                          value={values.newPassword}
                          errors={errors.newPassword}
                          onChange={handleChange}
                          touched={touched.newPassword}
                        />
                        <ErrText errors={errors.newPassword} touched={touched.newPassword}/>
                      </div>
                      <div className="log-box">
                        <LabelText
                          title={t('passwordch.newpwcheck')}
                          required={false}
                        />
                        <Field
                          as={TextInput}
                          name='confirmPassword'
                          inputType="password"
                          value={values.confirmPassword}
                          errors={errors.confirmPassword}
                          onChange={handleChange}
                          touched={touched.confirmPassword}
                        />
                        <ErrText errors={errors.confirmPassword} touched={touched.confirmPassword}/>
                      </div>                 
                      <SubBtn
                        title= {t('passwordch.check')}
                        disabled={isSubmitting}
                        id="click_change_password"
                      />    
                  
                  </Form>
              )}

          </Formik>
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
export default Password;
