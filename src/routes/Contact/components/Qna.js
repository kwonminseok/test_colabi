import React, {useState,useCallback, useEffect} from 'react';
import { Input, Table,} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
const Qna = () => {
  const { t, i18n } = useTranslation();
  const [inputs, setInputs] = useState({
    bcEmail: '',
    bcSubject: '',
    content: '',
    checkEmail:""
  })
  const { bcEmail, bcSubject, bcContent,checkEmail} = inputs;


  useEffect(()=>{
    document.title = `${t('contact.qna')} | Bitcolabi`;
},[t])

  const handleChnage = (e) => {
    const {name, value} = e.target;
    switch(name){
      case 'bcEmail':{
        if(value.length>150){
          setInputs({
            ...inputs,
            bcEmail: value.slice(0,150)
          })
        }else{
          setInputs({
            ...inputs,
            bcEmail: value
          })
        }
        break;
      }
      case 'bcSubject':{
        if(value.length>150){
          setInputs({
            ...inputs,
            bcSubject: value.slice(0,150)
          })
        }else{
          setInputs({
            ...inputs,
            bcSubject: value
          })
        }
        break;
      }
      case 'bcContent':{
        if(value.length>600){
          setInputs({
            ...inputs,
            bcContent: value.slice(0,600)
          })
        }else{
          setInputs({
            ...inputs,
            bcContent: value
          })
        }
        
        break;
      }
      default: break;
    }
  }

  const checkEmailValid = useCallback(() =>{
    var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (regExp.test(bcEmail)) {
        setInputs({
          ...inputs,
          checkEmail: ''
        })
        sendEmail()
    }else if(bcEmail ===''){
      setInputs({
        ...inputs,
        checkEmail: 'notEnter'
      })
    }else{
      setInputs({
        ...inputs,
        checkEmail: 'invalid'
      })
    }
  },[bcEmail])

  const generateDOMEmail = useCallback(() => {
    switch (checkEmail) {
    case 'invalid': 
        return t('accountregister.invalidemail')
    case 'notEnter':
        return t('accountregister.notemail')
    default:
        return '';
    }
},[checkEmail,t])

  const handleSubmit = (e) => {
    e.preventDefault();
    checkEmailValid();
  }

  const sendEmail = async () =>{
    let a = bcEmail.indexOf("@");
    let name1 = bcEmail.substring(0,a);
    let name2 = bcEmail.substring(a+1).toLowerCase();
    let name3 = name1+"@"+name2;
    await axios.post('/api/v2/contact', {Email : name3, Subject : bcSubject, Contents:bcContent})
    .then(response =>{
      if(response.data.status === 'SUCCESS'){
        if(response.data.message ==="Successfully sent the inquiry"){
          confirmAlert({
            title: t('qnaemail.success'),
            message: t('qnaemail.sucon'),
            buttons: [
              {
                label: 'Yes',
                onClick: () => document.location.href = '/'
              }
            ]
          });
        }
      }else if(response.data.status ==='FAILURE'){
        confirmAlert({
          title: t('qnaemail.fail'),
          message: t('qnaemail.failcon'),
          buttons: [
            {
              label: 'Yes',
              onClick: () => document.location.href = '/'
            }
          ]
        });
      }
      else{
        confirmAlert({
          title: t('qnaemail.fail'),
          message: t('qnaemail.failcon'),
          buttons: [
            {
              label: 'Yes',
              onClick: () => document.location.href = '/'
            }
          ]
        });
      }
    })
    .catch(e=>{
      console.log(e)
      document.location.href = '/';
  })
  }

  return(
    <div style={{ padding: '25px 0px' }}>
          <form name="inputs" onSubmit={handleSubmit}>
        <Table style={{color:"#333"}}>
          <tbody>
            <tr
              style={{
                borderTop: 'none !important',
                fontSize: '15px',
                lineHeight: '30px',
                textAlign:"center"
              }}
            >
              <td style={{ borderTop: 'none' }}>
                {t('notices.subject')} <span style={{ color: 'red' }}>*</span>
              </td>
              <td style={{ borderTop: 'none' }}>
                <Input
                  value={bcSubject}
                  name="bcSubject"
                  onChange={handleChnage}
                  required
                />
              </td>
            </tr>
            <tr style={{
                fontSize: '15px',
                lineHeight: '30px',
                textAlign:"center"
              }}>
            <td >
            {t('notices.content')} <span style={{ color: 'red' }}>*</span>
              </td>
              <td>
                <Input
                  type='textarea'
                  value={bcContent}
                  name="bcContent"
                  onChange={handleChnage}
                  style={{minHeight:"180px", maxHeight:"300px"}}
                  className='mb-2'
                  required
                />
              </td>
            </tr>

            <tr
              style={{
                fontSize: '15px',
                lineHeight: '30px',
                textAlign:"center"
              }}
            >
              <td >
              {t('notices.email')} <span style={{ color: 'red' }}>*</span>
              </td>
              <td >
                <Input
                  value={bcEmail}
                  name="bcEmail"
                  onChange={handleChnage}
                  required
                />
                <div className='valNicksm2 '>
                  {generateDOMEmail()}
              </div>
              </td>
            </tr>
          </tbody>
        </Table>
        <div style={{padding:"12px", float:"right"}}>
        <input type="submit"  value= {t('notices.submit')} className="qnasummit"></input>
        </div>
        </form>
      </div>
  )
}

export default Qna;