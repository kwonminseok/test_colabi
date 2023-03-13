import React, {useState,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector,useDispatch } from 'react-redux';
import {
  Button,
  ModalHeader,
  ModalBody,
  Modal,
} from 'reactstrap';
import Slider from 'rc-slider';

function LeverageButton ({symbol,position,userstatus}){
    const {t, i18n} = useTranslation();
    const [modal, setModal] = useState(false)
    const [leverage, setLeverage] = useState(20);
    const [levValue, setLevValue] = useState(20);
    const mark = useSelector(state => state.trade.markLabel)
    const max = useSelector(state => state.trade.symbolMax)
    const dispatch = useDispatch();
    const [maxNotion ,setMexNotion] = useState(0);

    useEffect(() => {
        if(position.length){
            setLeverage(parseInt(position[0].leverage))
            setLevValue(parseInt(position[0].leverage))
            setModal(false)
            setMexNotion(calcMaxNotion(position[0].leverage))
        }
    },[position,symbol])

    const calcMaxNotion = (value) => {
      if(value === 1){
        return max[0].max;
      }else{
        for(var i=0; i<max.length; i++){
          if(value>max[i].leverage && value<=max[i+1].leverage){
            return max[i+1].max;
          }
        }
      }
    }

    const handleLevValue = (e) => {
        setLevValue(e.target.value)
        setMexNotion(calcMaxNotion(e.target.value))
    }
    const ChangeLevValue = value => {
        setLevValue(value)
        setMexNotion(calcMaxNotion(value))
    }

    const changeLeverage = () => {

        if(levValue !==leverage){
            dispatch({
              type:"api/CHANGE_LEVERAGE",
              payload:{
                symbol: symbol,
                leverage: levValue
              }
            })
        }
        setModal(false)
    }

    const handleModal = () => {
      if(userstatus ==='cantrade'){
        setModal(true)
      }
    }

    const closeModal = () =>{
      setModal(false)
      setLevValue(leverage)
      setMexNotion(calcMaxNotion(leverage))
    }
    
   return(
       <>
        <button
            className='orderbtnd'
            onClick={handleModal}
        >
            {leverage}✕
        </button>
        <Modal isOpen={modal}>
        <ModalHeader className="modlaheader">
            <span style={{fontWeight:"600"}}>
            {symbol} {t('order.leverage.title')}
            </span>
           
            <span className="fr" style={{cursor:"pointer"}}>
            <i
              className='fa fa-fw fa-close'
              aria-hidden='true'
              onClick={closeModal}
            />
            </span>
          </ModalHeader>
          {max.length ?
          <ModalBody>
            <div className="levchange">
              <Button className="levminusbtn" onClick={() => setLevValue(levValue-1)}>
                -
              </Button>
              <div className='levbox'>
                <div className='levrl'>
                  <input
                    type='number'
                    className='levinput'
                    value={levValue}
                    onChange={handleLevValue}
                  />
                  <div className="levsuf">
                    <div className="levsfu"> 
                      ✕
                    </div>
                  </div>
                </div>
              </div>
             
              <Button className="levplusbtn" onClick={() => setLevValue(levValue+1)}>
                +
              </Button>
            </div>
            <div className="evdvksd">
            <Slider
              style={{ marginBottom: '30px', fontSize:"0.9rem", fontWeight:"600" }}
              marks={mark}
              step={1}
              value={levValue}
              min={1}
              max={max[max.length-1].leverage}
              onChange={ChangeLevValue}
              trackStyle={{ backgroundColor: '#58b589', height:"5px"}}
              railStyle={{ backgroundColor: '#eaecef', height:"5px" }}
                dotStyle={{
                  backgroundColor: '#eaecef',
                  border: 'none',
                  borderColor: '#fff',
                  width:"15px",
                  height:"15px",
                  bottom:"-6px"

                }}
                handleStyle={{ border: '4px solid #58b589', boxShadow: 'none', width:"21px", height:"21px", marginTop:"-8px" }}
                activeDotStyle={{
                  backgroundColor: '#58b589',//b3bdc9
                  borderColor: '#fff',
                }}
            />
            </div>
            {maxNotion !== 0 ? <div className="levmax">{t('order.leverage.maximumtext')} <span className="levmaxnum">{maxNotion}</span>USDT</div> : <div style={{minHeight:"24px"}}></div>}
            <div className="levdi">
              <Button className="levok" onClick={changeLeverage}>{t('order.leverage.confirm')}</Button>
            </div>
          </ModalBody>
          :<></>}
        </Modal>
        </>
   )
}

export default React.memo(LeverageButton);