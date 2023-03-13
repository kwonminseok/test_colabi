import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

class NotLog extends React.Component{
    generateDOM () {
        const { userstatus, t } = this.props;
        switch (userstatus) {
          case 'guest': {
            return (
              <div className='flex-1 reserve'>
                <a style={{ marginRight: '3px' }} href='/login'>
                  {t('login.title')}
                </a>{' '}
                {t('notvalid.or')}
                <a
                  style={{ marginRight: '6px', marginLeft: '3px' }}
                  href='/register'
                >
                  {t('register.title')}
                </a>
                {t('notvalid.totrade')}
              </div>
            );
          }
          case 'apiinvalid': {
            return (
              <div className='flex-1 reserve'>
                {t('notvalid.validapi')}
                <a style={{ marginLeft: '8px' }} href='/mypage/account'>
                  {t('notvalid.modifyapi')}
                </a>
              </div>
            );
          }
          case 'noneapi': {
            return (
              <div className='flex-1 reserve'>
                <a style={{ marginLeft: '8px' }} href='/mypage/account'>
                  {t('notvalid.registerapi')}
                </a>
              </div>
            );
          }
          case 'cannottrade': {
            return (
              <div className='flex-1 reserve'>{t('notvalid.cantnottrade')}</div>
            );
          }
          case 'notmember': {
            return (
              <div className='flex-1 reserve'>
                <a style={{ marginLeft: '8px' }} href='/mypage/account'>
                  {t('notvalid.joinmembership')}
                </a>
              </div>
            );
          }
        default: {
            return <></>
        }
        }
      }


      render(){
          return (
              <div style={{height:"100%", display:"flex"}}>
                {this.generateDOM()}
              </div>
          )
      }

}

const mapStateToProps = ({ user }) => ({
    userstatus: user.userstatus,
  });
  
export default withTranslation()(connect(mapStateToProps, undefined)(NotLog));
  
