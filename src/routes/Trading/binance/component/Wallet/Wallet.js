import React, {useMemo} from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import WalletRow from './component/WalletRow'
function getCrossedLeverage(crossWallet,crossPositionValue) {

    if(crossWallet>0){
        return parseFloat(crossPositionValue/crossWallet).toFixed(1)
    }else{
        return 0;
    }
}

function getCrossedMarginRatio (crossWallet,crossMaintMargin) {
    if(crossWallet>0){
        return parseFloat(100*crossMaintMargin/crossWallet).toFixed(2)
    }else return 0;
}

const Wallet = () =>{
    const { t } = useTranslation();
    const {userBalance, mbc}= useSelector(state =>({
        mbc: state.user.mbc,
        userBalance: state.user.userBalance
    }))

    const mr = useMemo(()=> getCrossedMarginRatio(userBalance.crossWallet,userBalance.crossMaintMargin),[userBalance.crossWallet,userBalance.crossMaintMargin])
    const ml = useMemo(() =>getCrossedLeverage(userBalance.crossWallet,userBalance.crossPositionValue),[userBalance.crossWallet,userBalance.crossPositionValue])

    return(
        <>
            {mbc.mb !=='md' || !mbc.bookorderMode ? 
            <div className="margin-title">{t('wallet.title')}</div>
            :<></>}
            <div className="margin-con">
                <WalletRow
                    title={t('wallet.marginbalance')}
                    num={1*userBalance.walletBalance+userBalance.unRealizedPnl}
                />
                <WalletRow
                    title={t('wallet.walletbalance')}
                    num={1*userBalance.walletBalance}
                />
                <WalletRow
                    title={t('wallet.unrealizedpnl')}
                    num={userBalance.unRealizedPnl}
                />
                <WalletRow
                    title={t('wallet.availablebalance')}
                    num={userBalance.availableBalance}
                />
                <div className="margin-info">
                    <div className="ccc"> {mr}% {t('wallet.crossmarginratio')} {ml}{t('wallet.leverage')}</div>
                </div>
            </div>
        </>
        )
}

export default Wallet;


// class Wallet extends React.Component{


//     getCrossedLeverage = () => {
//         const {userBalance} = this.props;

//         if(userBalance.crossWallet >0){
//             return parseFloat(userBalance.crossPositionValue/userBalance.crossWallet).toFixed(1)
//         }else{
//             return 0;
//         }
//     }

//     getCrossedMarginRatio = () => {
//         const {userBalance} = this.props;

//         if(userBalance.crossWallet>0){
//             return parseFloat(100*userBalance.crossMaintMargin/userBalance.crossWallet).toFixed(2)
//         }else return 0;
//     }


//     render(){
//         const {userBalance, mbc, t} = this.props;
        
//         return(
//         <>
//             {mbc.mb !=='md' || !mbc.bookorderMode ? 
//             <div className="margin-title">{t('wallet.title')}</div>
//             :<></>}
//             <div className="margin-con">
//                 <div className="margin-info">
//                     <div className="ttt">{t('wallet.marginbalance')}</div>
//                     <div className="con">{parseFloat(1*userBalance.walletBalance+userBalance.unRealizedPnl).toFixed(2)} USDT</div> 
//                 </div>
//                 <div className="margin-info">
//                     <div className="ttt">{t('wallet.walletbalance')}</div>
//                     <div className="con">{parseFloat(1*userBalance.walletBalance).toFixed(2)} USDT</div> 
//                 </div>
//                 <div className="margin-info">
//                     <div className="ttt">{t('wallet.unrealizedpnl')}</div>
//                     <div className="con">{parseFloat(userBalance.unRealizedPnl).toFixed(2)} USDT</div> 
//                 </div>
//                 <div className="margin-info">
//                     <div className="ttt">{t('wallet.availablebalance')}</div>
//                     <div className="con">{parseFloat(userBalance.availableBalance).toFixed(2)} USDT</div> 
//                 </div>
//                 <div className="margin-info">
//                     <div className="ccc"> {this.getCrossedMarginRatio()}% {t('wallet.crossmarginratio')} {this.getCrossedLeverage()}{t('wallet.leverage')}</div>
//                 </div>
//             </div>
//         </>
//         )
//     }
// }

// const mapStateToProps = ({ user }) => ({
//     userBalance: user.userBalance,
//     mbc: user.mbc
//   });

// export default withTranslation()(connect(mapStateToProps, undefined)(Wallet));


