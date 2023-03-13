import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Container,
  Col,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Modal, 
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { HeaderMain } from '../components/HeaderMain';
import AccountTable from './component/AccountTable';
import { MdContentCopy } from 'react-icons/md';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import {contentInfo2} from '../../../components/Notification/Notification'
import MembershipHistory from './component/MembershipHistory'
var QRCode = require('qrcode.react');


const Account = () =>{
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false)
  const logstatus = useSelector(state => state.user.logstatus)
  const userInfo = useSelector(state => state.user.userInfo)
  const address = useSelector(state => state.auth.getIn(['xrp', 'address']))

  useEffect(()=>{
    dispatch({
        type:'user/USER_AUTH_TOTAL',
        payload:'account'
    })

    document.title = `${t('account.title')} | Bitcolabi`;

  },[])

  useEffect(()=>{
    if(logstatus ==='LOGOUT'){
      document.location.href = '/';
    }
  },[logstatus])

  return (
    <>
      {userInfo.isReady ? (
        <Container style={{minHeight:"calc(100vh - 171px)", minWidth:"365px", marginBottom:"10px"}}>
          <HeaderMain title={t('account.title')} className='mb-2 mt-4' />
          <Col className='mb-4 mb-lg-0' style={{padding:0, border:"1px solid #dadce0", borderRadius:"3px"}}>
            <AccountTable userInfo={userInfo} />
          </Col>
            <Col className="mt-4 pb-2" style={{border:"1px solid #dadce0", borderRadius:"3px"}}>
            <Col lg={3}>
              <div className='mt-3 mb-3 account-membership accheader'>
                Membership
              </div>
            </Col>
            <Col lg={12}>
                <div className="flex">
                 <div className='memspan  mt-2 mb-2 account-membership' style={{flex:3}}>
                       <span style={{color:"#333"}}>{userInfo.isMem}</span>
                  </div>
                  <div className="mt-2 mb-2 linkcol acc" style={{placeSelf:"center"}}>
                    {userInfo.isMem !== 'Free'?
                      <span style={{cursor: 'pointer'}} onClick={() => setModal(true)}>Extend membership</span>
                    :<></>}
                  </div>
                </div>
            </Col>
            </Col>
            <Col className="mt-4 mb-lg-0" style={{border:"1px solid #dadce0", borderRadius:"3px"}}>
            <Col lg={12}>
              <div
                className='mt-3 mb-3 account-membership accheader'
              >
                Membership History
              </div>
            </Col>
            <Col lg={12} className="account-membership-his">
            <MembershipHistory
              history={userInfo.history}
              t={t}/>
            </Col>
            </Col>
        </Container>
      ) : (
        <></>
      )}
      <Modal target='modalDefault101' isOpen={modal}>
        <ModalHeader tag='h6' style={{ width: '100%' }}>
          <div className='orderbookorder mdol-title'>Upgrade Membership</div>
          <span className='closeaction'>
            <i
              className='fa fa-fw fa-close'
              aria-hidden='true'
              style={{cursor:"pointer"}}
              onClick={() => setModal(false)}
            />
          </span>
        </ModalHeader>
        <ModalBody>
          <div className='flex'>
            <div className='flex-1 pricing'>
              <div className='css-fmklwe2'>1 month</div>
              <div className='css-fmkeldw2'> 50 XRP</div>
            </div>
          </div>
          <div>
            <span className='deposanem'>XRP Deposit Address</span>
            <div className='deposadres'>
              {address}
              <span className='copyadre' style={{cursor:"pointer"}}>
              <CopyToClipboard text={address} 
              onCopy={()=>toast.success(contentInfo2('Copied to clipboard'))}
              >
                  <MdContentCopy />
                </CopyToClipboard>
              </span>
            </div>
            <span className='deposanem'>Destination Tag</span>
            <div className='deposadres'>
            {userInfo.tag}
              <span className='copyadre' style={{cursor:"pointer"}}>
                <CopyToClipboard text={userInfo.tag} 
                onCopy={()=>toast.success(contentInfo2('Copied to clipboard'))}
                >
                  <MdContentCopy />
                </CopyToClipboard>
              </span>
            </div>
            <span className='deposanem'>QR code</span>
            <div style={{ textAlign: 'center' }}>
              <QRCode
                value={'rPZ8PTVzpwJE4MMiGhg41d6Q44uoU1EBU6'}
                width={150}
                height={150}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="waringcont">Send Only XRP to this address.
          </div>
          <div className="waringcont2">
            Errors/losses that may occur if you deposit another digital asset to this address are not recoverable.
          </div>
        </ModalFooter>
      </Modal>
      <ToastContainer
        position='bottom-right'
        autoClose={2500}
        draggable={false}
        hideProgressBar={true}
      />
    </>
  );


}

export default Account;
