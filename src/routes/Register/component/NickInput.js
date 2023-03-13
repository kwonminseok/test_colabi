import React, { useMemo } from 'react';
import LabelText from '../../../components/InputBox/component/LabelText';

function setClass(isNick){
  if(isNick !=='valid' && isNick !==''){
      return 'logbox invalidborder'
  }else return 'logbox '
}

const NickInput = (props) => { 

  const {title,value,name,handleChange,isNick,checkNick,checkName,t}= props;
  const classes = useMemo(()=>setClass(isNick),[isNick])
  const  generateDOMNick = () => {
    switch (isNick) {
      case 'invalid':
    return <div className='valNicksm2 ' >{t('accountregister.existnick')}</div>;
      case 'valid':
        return <div className='valNicksm3 ' >{t('accountregister.availablenick')}</div>;
      case 'notcheck':
        return <div className='valNicksm2 ' >{t('accountregister.checknick')}</div>;
      case 'notenough':
        return <div className='valNicksm2 ' >{t('accountregister.notenoughnick')}</div>;
      default:
        return <div className='valNicksm2 ' ></div>;
    }
  };


    return(
        <>
              <LabelText
                title={title}
                required={true}
              />
              <div className="flex">
                <div className={classes}>
                  <input
                    type='text'
                    className="loginput-box"
                    style={{width:"calc(100% - 80px)"}}
                    value={value}
                    name={name}
                    onChange={handleChange}
                  />
                </div>
                <button type='button' onClick={checkNick} className='regsjdfkD3'>
                    {checkName}
                </button>
              </div>
              {generateDOMNick()}
        </>
    )
}

export default NickInput;