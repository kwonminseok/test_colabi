import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, CardHeader } from '../../../../../components';
import { CardBody } from 'reactstrap';
import OrderTab from './component/OrderTab';
import Wallet from '../Wallet/Wallet';
const Order = () => {
  const { t } = useTranslation();
  const userstatus = useSelector(state => state.user.userstatus);
  return (
    <>
    <Card style={{ height: '100%',borderRadius:"0"}}>
      <CardHeader className="titleheader">{t('order.title')}</CardHeader>
      <CardBody className='futureoverfowdl2'>
        <OrderTab
          userstatus={userstatus}
          t={t}
        />
        {userstatus === 'cannottrade' || userstatus === 'cantrade' ? 
        <div className="hong-asset" >
          <Wallet />
        </div> 
        :<></>
        }
      </CardBody>
    </Card>
    </>
  );
};

export default Order;
