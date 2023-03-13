import React from 'react';
import { GrStatusWarning } from 'react-icons/gr';
import { withTranslation } from 'react-i18next';
import { Card } from '../../../../components';

class NotApi extends React.Component {
  render () {
    const {t} = this.props;
    return (
      <div style={{ padding: '100px 0px' }} className='orderbookorder'>
        <Card
          style={{
            paddingTop: '30px',
            width: '720px',
            backgroundColor: 'initial',
            border: 'none',
            boxShadow: 'none',
          }}
        >
            <div>
            <GrStatusWarning size={48} color="#353333"/>
            </div>
        <div className='mysetNLKD2ds'>{t('buttontoast.noneapi')}</div>

            <a href="/mypage/account" className='mysetCNFKLds'>
                <div className='mysetDNdnjFG'> {t('setting.api')}</div>
                {/* <UserCheck style={{ flex: '1' }} size={48} /> */}
              </a>
        </Card>
      </div>
    );
  }
}



export default withTranslation()(NotApi);
