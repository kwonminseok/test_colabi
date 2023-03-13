import React from 'react';

import { withTranslation } from 'react-i18next';
import queryString from 'query-string';
import axios from 'axios';
import { Card } from '../../components';
import ReactCodeInput from 'react-verification-code-input';
import { ToastContainer, toast } from 'react-toastify';
import {contentErrornoTitle,contentInfo2 } from '../../components/Notification/Notification';

class VerificateRegister extends React.Component {

  state ={
    email: 'undefined',
    emailSentTime: 0,
    isCode: '',
    time: 0,
  }

  componentDidMount () {
    const a = queryString.parse(this.props.location.search);
    if (a.email !== undefined) {
      const isEmail = this.isEmail(a.email);
      if (isEmail) {
        this.getEmailInfo(a.email);
      }else{
        document.location.href = '/';
      }
    } else {
      document.location.href = '/';
    }
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  componentDidUpdate (prevState) {
    if (this.state.time !== prevState.time) {
      if (this.state.time < 0) {
        clearInterval(this.timer);
        this.setState({
          time: 0,
        });
      }
    }
  }

  isEmail (email) {
    var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regExp.test(email);
  }

  getEmailInfo = async email => {
    const {t} = this.props;
    axios.post('/api/v2/traders/email/info', { Id: email })
    .then(response => {
      if(response.data.status==='SUCCESS'){
        const res = response.data;
        var nowTime = new Date().getTime();
        switch (res.message) {
          case 'Invalid Email': {
            document.location.href = '/';
            
            break;
          }
          case 'Sent Email Infomation': {
            if (res.isActive) {
              document.location.href = '/';
              break;
            } else {
              this.setState({
                email: res.email,
                emailSentTime: res.emailSentTime,
              });
              nowTime = nowTime - res.emailSentTime;
              if (nowTime > 60000) {
                this.sendEmailCode();
                
              } else {
                
                this.timer = setInterval(
                  () =>
                    this.setState({
                      time: 60000 - (Date.now() - this.state.emailSentTime),
                    }),
                  1000,
                );
              }
              break;
            }
          }
          default:{
            break;
          }
        }
      }else if(response.data.status==='FAILURE'){

      }

    })
    .catch(e=>{
      
    })
  };

  sendEmailCode = async () => {
    const {t} = this.props;
    clearInterval(this.timer);
    this.setState({
      time: 60000,
    });

    axios
      .post('/api/v2/traders/email/pushing', { Id: this.state.email })
      .then(response => {
        if(response.data.status ==="SUCCESS"){
          if (response.data.message === 'Successfully sent email') {
            toast.success(contentInfo2(t('toast.mailsuccess')))
            this.setState({
              emailSentTime: response.data.EmailSentTime,
            });
            this.timer = setInterval(
              () =>
                this.setState({
                  time: 60000 - (Date.now() - this.state.emailSentTime),
                }),
              1000,
            );
          }else if(response.data.message ==='Invalid Email'){
            document.location.href = '/';
          }
        }else if(response.data.status ==="FAILURE"){
          toast.error(contentErrornoTitle(t('toast.mailfailed')))
        }
      })
      .catch(e => {
        toast.error(contentErrornoTitle(t('toast.mailfailed')))
      });
  };


  handleComplete = async e => {
    const {t} = this.props;
    const num = parseInt(e);
    axios
      .post('/api/v2/registerconfirm', { Id: this.state.email, RandNumber: num })
      .then(response => {
        if(response.data.status ==='SUCCESS'){
          if(response.data.message==="Auth Code Confirmed, Successfully logged in"){
            clearInterval(this.timer);
            // document.location.href = '/mypage/setting';
            this.props.history.push('/mypage/setting');
          }else if(response.data.message ==='Activation code error'){
            this.setState({
              isCode: 'invalid',
            });
          }else if(response.data.message ==="Verification Time Over"){
            this.setState({
              isCode: 'invalid',
            });
            //this.sendEmailCode()
          }else if(response.data.message ==="Invalid Email or Password"){
            document.location.href = '/'
          }
        }else if(response.data.status ==='FAILURE'){
          toast.error(contentErrornoTitle(t('toast.mailfailed')))
        }
      })
      .then(e => {
        toast.error(contentErrornoTitle(t('toast.mailfailed')))
      });
  };

  render () {
    const { time, isCode } = this.state;
    const {t} = this.props;
    return (
      <>
      <div className='orderbookorder' style={{minHeight:"calc(100vh - 175px)"}}>
        <Card className="log-card" style={{marginTop:"38px"}}>
          <div className='valisnklsku'> {t('verficateaccount.title')} </div>
          <div className='valiTGND2'>
          {t('verficateaccount.subtitle')}
          </div>
          <div className='valiTGND2'>{t('verficateaccount.validtime')}</div>
          <ReactCodeInput
            type='number'
            fields={6}
            onComplete={this.handleComplete}
          />
          {isCode === 'invalid' ? (
            <div className='valiDKMLWf'>
              {t('verficateaccount.invalid')}
              
            </div>
          ) : (
            <></>
          )}
          {time > 0 ? (
            <div className='valiENndls2'>
             {t('verficateaccount.lefttime')} {parseFloat(time / 1000).toFixed(0)}s
            </div>
          ) : (
            <div
              type='button'
              onClick={this.sendEmailCode}
              className='valiENndls'
            >
             {t('verficateaccount.resend')}
            </div>
          )}
        </Card>
      </div>
      <ToastContainer
          position='bottom-right'
          autoClose={2500}
          draggable={false}
          hideProgressBar={true}
        />
      </>
    );
  }
}

export default withTranslation()(VerificateRegister);
