import React from 'react'
import { Button } from 'reactstrap';
import hoo from '../../../icons/hoo4.png';

function Landing({t,islog}) {

    const onClickGoTrade = () =>{
        
        document.location.href = '/trade/binance/BTCUSDT';
    }

    const onClickGoLogin = () =>{
        
        document.location.href = '/login';
    }

    return(
        <div className="maintitle" style={{backgroundImage:`url(${hoo})`}}>
          <div className="majorhead">{t('main.title')}</div>
          <div className="subhead">{t('main.sub')}</div>
        
          <div>
          <Button className="gotradebtu" onClick={onClickGoTrade} >
                {t('main.gotrade')}
          </Button>
          {islog ==='LOGOUT'? 
          <Button className="main-logbtu" onClick={onClickGoLogin} >{t('main.login')}</Button>
          :<></>
        }
          </div>
        </div>
    )
}

export default Landing;