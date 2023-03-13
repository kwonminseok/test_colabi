import React, { Suspense } from 'react';
import { LogoLayout } from './Layouts/LogoLayout';
import  LayoutNavbar  from './Layouts/LayoutNavbar';
import { TradeLayoutNavbar } from './Layouts/TradeLayoutNavbar';
import { Route, Switch, Redirect } from 'react-router';
import SyncLoader from "react-spinners/SyncLoader";
import TestGrid from './Trading/binance/TestGrid';
import Login4 from './Login/Login4';
import Main from './Main/Main';
import Register3 from './Register/Register3'
import VerificateRegister from './Register/VerificateRegister'
import Setting from './Mypage/setting/Setting';
import ApiChange from './Mypage/api/ApiChange';
import Account from './Mypage/account/Account';
import Password from './Mypage/password/Password';
import Balancet from './Mypage/balance/Balancet';
import Contact from './Contact/Contact';
import ForgetPassword from './Register/ForgetPassword'
import Hong from './hong/Hong';
import Riot from './riot/Riot';
export const RoutedContent = () => {
 
  return (
    <Suspense fallback={<div className='flex-1 reserve'> <SyncLoader size={10}color="#58b589"margin="2px" /> </div>}>
      <Switch>
        {/* <Redirect from="/" to="/" exact /> */}
        <Route path='/' exact component={Main} />

        {/* login, register page Routes  */}
        <Route path='/login' component={Login4} />

        <Route component={Register3} path='/register' />
        <Route component={ForgetPassword} path='/reset-password'/>
        <Route
          component={VerificateRegister}
          path='/register-verification/email'
        ></Route>
        {/*    Trading Routes   */}
        {/* <Route component={BTCUSD} path="/trade/BTCUSD" />
        <Route component={ETHUSD} path="/trade/ETHUSD" /> */}

        <Route component={TestGrid} path='/trade/binance/BTCUSDT' />
        {/* 125 */}
        <Route component={TestGrid} path='/trade/binance/ETHUSDT' />
        {/* 100 */}
        <Route component={TestGrid} path='/trade/binance/ADAUSDT' />
        <Route component={TestGrid} path='/trade/binance/BNBUSDT' />
        <Route component={TestGrid} path='/trade/binance/DOTUSDT' />
        <Route component={TestGrid} path='/trade/binance/EOSUSDT' />
        <Route component={TestGrid} path='/trade/binance/ETCUSDT' />
        <Route component={TestGrid} path='/trade/binance/LINKUSDT' />
        <Route component={TestGrid} path='/trade/binance/LTCUSDT' />
        <Route component={TestGrid} path='/trade/binance/TRXUSDT' />
        <Route component={TestGrid} path='/trade/binance/XLMUSDT' />
        <Route component={TestGrid} path='/trade/binance/XMRUSDT' />
        <Route component={TestGrid} path='/trade/binance/XRPUSDT' />
        <Route component={TestGrid} path='/trade/binance/XTZUSDT' />
        <Route component={TestGrid} path='/trade/binance/BCHUSDT' />
        {/* 75 */}
        <Route component={TestGrid} path='/trade/binance/AAVEUSDT' />
        <Route component={TestGrid} path='/trade/binance/ALGOUSDT' />
        <Route component={TestGrid} path='/trade/binance/ALPHAUSDT' />
        <Route component={TestGrid} path='/trade/binance/ATOMUSDT' />
        <Route component={TestGrid} path='/trade/binance/AVAXUSDT' />
        <Route component={TestGrid} path='/trade/binance/AXSUSDT' />
        <Route component={TestGrid} path='/trade/binance/BALUSDT' />
        <Route component={TestGrid} path='/trade/binance/BANDUSDT' />
        <Route component={TestGrid} path='/trade/binance/BATUSDT' />
        <Route component={TestGrid} path='/trade/binance/BELUSDT' />
        <Route component={TestGrid} path='/trade/binance/BLZUSDT' />
        <Route component={TestGrid} path='/trade/binance/BZRXUSDT' />
        <Route component={TestGrid} path='/trade/binance/COMPUSDT' />
        <Route component={TestGrid} path='/trade/binance/CRVUSDT' />
        <Route component={TestGrid} path='/trade/binance/CTKUSDT' />
        <Route component={TestGrid} path='/trade/binance/CVCUSDT' />
        <Route component={TestGrid} path='/trade/binance/DASHUSDT' />
        <Route component={TestGrid} path='/trade/binance/DEFIUSDT' />
        <Route component={TestGrid} path='/trade/binance/DOGEUSDT' />
        <Route component={TestGrid} path='/trade/binance/EGLDUSDT' />
        <Route component={TestGrid} path='/trade/binance/ENJUSDT' />
        <Route component={TestGrid} path='/trade/binance/FILUSDT' />
        <Route component={TestGrid} path='/trade/binance/FLMUSDT' />
        <Route component={TestGrid} path='/trade/binance/FTMUSDT' />
        <Route component={TestGrid} path='/trade/binance/HNTUSDT' />
        <Route component={TestGrid} path='/trade/binance/ICXUSDT' />
        <Route component={TestGrid} path='/trade/binance/IOSTUSDT' />
        <Route component={TestGrid} path='/trade/binance/IOTAUSDT' />
        <Route component={TestGrid} path='/trade/binance/KAVAUSDT' />
        <Route component={TestGrid} path='/trade/binance/KNCUSDT' />
        <Route component={TestGrid} path='/trade/binance/KSMUSDT' />
        <Route component={TestGrid} path='/trade/binance/LRCUSDT' />
        <Route component={TestGrid} path='/trade/binance/MATICUSDT' />
        <Route component={TestGrid} path='/trade/binance/MKRUSDT' />
        <Route component={TestGrid} path='/trade/binance/NEARUSDT' />
        <Route component={TestGrid} path='/trade/binance/NEOUSDT' />
        <Route component={TestGrid} path='/trade/binance/OCEANUSDT' />
        <Route component={TestGrid} path='/trade/binance/OMGUSDT' />
        <Route component={TestGrid} path='/trade/binance/ONTUSDT' />
        <Route component={TestGrid} path='/trade/binance/QTUMUSDT' />
        <Route component={TestGrid} path='/trade/binance/RENUSDT' />
        <Route component={TestGrid} path='/trade/binance/RLCUSDT' />
        <Route component={TestGrid} path='/trade/binance/RSRUSDT' />
        <Route component={TestGrid} path='/trade/binance/RUNEUSDT' />
        <Route component={TestGrid} path='/trade/binance/SNXUSDT' />
        <Route component={TestGrid} path='/trade/binance/SOLUSDT' />
        <Route component={TestGrid} path='/trade/binance/SRMUSDT' />
        <Route component={TestGrid} path='/trade/binance/STORJUSDT' />
        <Route component={TestGrid} path='/trade/binance/SUSHIUSDT' />
        <Route component={TestGrid} path='/trade/binance/SXPUSDT' />
        <Route component={TestGrid} path='/trade/binance/THETHUSDT' />
        <Route component={TestGrid} path='/trade/binance/TOMOUSDT' />
        <Route component={TestGrid} path='/trade/binance/TRBUSDT' />
        <Route component={TestGrid} path='/trade/binance/UNIUSDT' />
        <Route component={TestGrid} path='/trade/binance/VETUSDT' />
        <Route component={TestGrid} path='/trade/binance/WAVESUSDT' />
        <Route component={TestGrid} path='/trade/binance/YFIIUSDT' />
        <Route component={TestGrid} path='/trade/binance/YFIUSDT' />
        <Route component={TestGrid} path='/trade/binance/ZECUSDT' />
        <Route component={TestGrid} path='/trade/binance/ZILUSDT' />
        <Route component={TestGrid} path='/trade/binance/ZRXUSDT' />
        <Route component={TestGrid} path='/trade/binance/ZENUSDT' />
        <Route component={TestGrid} path='/trade/binance/SKLUSDT' />
        <Route component={TestGrid} path='/trade/binance/BNTUSDT' />
        <Route component={TestGrid} path='/trade/binance/UNFIUSDT' />
        {/* 50 */}
        <Route component={TestGrid} path='/trade/binance/GRTUSDT' />
        <Route component={TestGrid} path='/trade/binance/1INCHUSDT' />
        <Route component={Hong} path='/hong'/>
        <Route component={Riot}  path='/riot'/>
        {/*    Mypage Routes   */}

        <Route component={Account} path='/mypage/account'></Route>
        <Route component={Balancet} path='/mypage/balance'></Route>
        <Route component={Password} path='/password'></Route>
        <Route component={Setting} path='/mypage/setting'></Route>
        <Route component={ApiChange} path='/api'></Route>
        {/*    Community Routes   */}

        {/* <Route component={Free} path="/community/free" />
        <Route component={Ideas} path="/community/ideas" />
        <Route component={Proof} path="/community/proof" /> */}

        {/*    Newsletter Routes   */}
        {/* <Route component={Newsletter} path="/newsletter" /> */}

        {/*    Contact Routes   */}
        <Route path="/support/notice/:id" component={Contact}/>
        <Route path="/support/faq/:id" component={Contact}/>
        <Route component={Contact} path="/support/notice" />
        {/* <Route component={Contact} path="/support/guide" /> */}
        <Route component={Contact} path="/support/qna" />
        <Route component={Contact} path="/support/faq" />
        <Route component={Contact} path="/support/terms" />
        <Route component={Contact} path="/support" />
        {/*    404    */}
        <Redirect to='/' />
      </Switch>
     </Suspense>
  );
};

//------ Custom Layout Parts --------
export const RoutedNavbars = () => {
  return (
    <Switch>
      <Route component={LogoLayout} path='/login' />
      <Route component={LogoLayout} path='/register' />
      <Route component={LogoLayout} path='/register-verification' />
      <Route component={LogoLayout} path='/reset-password' />
      <Route component={TradeLayoutNavbar} path='/trade' />
      <Route component={LayoutNavbar} />
    </Switch>
  );
};
