import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import NotLog from './NotLog';
import MobHeader from './MobHeader';
const MoMargin = () => {
    const isWM = useSelector(state => state.user.moblist.isWM)
    const userBalance = useSelector(state => state.user.userBalance)
    const userstatus = useSelector(state => state.user.userstatus)
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const onClickChangeIsWM = () => {
        dispatch({
            type: 'user/CHANGE_MOBLIST_ISWM',
            payload: !isWM
        })
    }
    const getCrossedMarginRatio = () => {
        if(userBalance.crossWallet>0){
            return parseFloat(100*userBalance.crossMaintMargin/userBalance.crossWallet).toFixed(2)
        }else return 0;
    }

    const getCrossedLeverage = () => {
        if(userBalance.crossWallet >0){
            return parseFloat(userBalance.crossPositionValue/userBalance.crossWallet).toFixed(1)
        }else{
            return 0;
        }
    }
    
    return(
        <div className="future-mob-container">
            <MobHeader
                name = {t('wallet.title')}
                isOpen={isWM}
                handleIsOpen={onClickChangeIsWM}/>
            {isWM?
            <div className="screenall" style={{height:"130px"}}>
                {userstatus ==='cantrade' || userstatus === 'cannottrade' ?
                <div className="mob-margin-con">
                    <div className="mob-margin-info">
                        <div className="ttt">{t('wallet.marginbalance')}</div>
                        <div className="con">{parseFloat(1*userBalance.walletBalance+userBalance.unRealizedPnl).toFixed(2)} USDT</div>
                    </div>
                    <div className="mob-margin-info">
                        <div className="ttt">{t('wallet.walletbalance')}</div>
                        <div className="con">{parseFloat(1*userBalance.walletBalance).toFixed(2)} USDT</div>
                    </div>
                    <div className="mob-margin-info">
                        <div className="ttt">{t('wallet.unrealizedpnl')}</div>
                        <div className="con">{parseFloat(userBalance.unRealizedPnl).toFixed(2)} USDT</div>
                    </div>
                    <div className="mob-margin-info">
                        <div className="ttt">{t('wallet.availablebalance')}</div>
                        <div className="con">{parseFloat(userBalance.availableBalance).toFixed(2)} USDT</div>
                    </div>
                    <div className="mob-margin-info">
                        <div className="ttt" style={{fontWeight:"600", color:"#111"}}>{getCrossedMarginRatio()}% {t('wallet.crossmarginratio')} {getCrossedLeverage()}{t('wallet.leverage')}</div>
                    </div>
                </div>
                :<NotLog/>
                }
            </div>
            :<></>
            }

        </div>
    )
}

export default MoMargin;
