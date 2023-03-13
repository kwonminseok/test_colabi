import React from 'react';
import {Card} from '../../../components';
import LineCharting from './LineCharting';
function ContactInfo ({name,num,symbol,symbolhl}) {


    const calcPercent = (data,num) => {
        var a = parseFloat((data[23]/data[0] *100)-100).toFixed(2);
    
        if(a>0){
          return (
            <>
                <span  className="main-klineprice">${parseFloat(data[23]).toFixed(num)}</span>
                <span className="main-klineper" style={{color:"#3ab87c"}}>+{a}%</span>
            </>
          )
        }else if(a<0){
          return (
            <>
                <span  className="main-klineprice">${parseFloat(data[23]).toFixed(num)}</span>
                <span className="main-klineper" style={{color:"#df3535"}}>{a}%</span>
            </>
          )
        }else {
          return (
            <>
                <span className="main-klineprice">${parseFloat(data[23]).toFixed(num)}</span>
                <span className="main-klineper" style={{color:"#8a93a5"}}>+{a}%</span>
            </>
          )
        }
    
      
    }


  return (
    <Card className='main-klinecard'>
      <div className='main-klinetitle'>{name}</div>
      <div className='main-klinecont'>
        {calcPercent(symbol.datasets[0].data, num)}
      </div>
      <div className='main-klinehl'>
        <span style={{ minWidth: '70px', display: 'inline-block' }}>
          24H High
        </span>
        <span>{symbolhl[0]}</span>
      </div>
      <div className='main-klinehl'>
        <span style={{ minWidth: '70px', display: 'inline-block' }}>
          24H Low
        </span>
        <span>{symbolhl[1]}</span>
      </div>
      <div className='main-klinechart'>
        <LineCharting data={symbol} />
      </div>
    </Card>
  );
}

export default React.memo(ContactInfo);
