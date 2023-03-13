import React from 'react'
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function UserWallet ({userstatus, mb}){
  const { t } = useTranslation();
    const walletBalance = useSelector(state => state.user.userBalance.walletBalance)
    const availableBalance = useSelector(state =>state.user.userBalance.availableBalance)
    return(
        <>
          {(userstatus === 'cannottrade' || userstatus ==='cantrade') && walletBalance !== undefined && availableBalance !== undefined && mb ==='lg'?
                <div className="future-wall">
                <div className="future-minwall">
                  <div className="ttt">
                    <div className="future-wall-title">{t('wallet.amount')}:</div>
                    <div className="future-wall-hm">{parseFloat(walletBalance).toFixed(2)} USDT</div>
                  </div>
                  <div className="ttt">
                    <div className="future-wall-title">{t('wallet.available')}:</div>
                    <div className="future-wall-hm">{parseFloat(availableBalance).toFixed(2)} USDT</div>
                  </div>
                </div>
                </div>
                :<></>
          } 
    </>
    )
}

export default React.memo(UserWallet)