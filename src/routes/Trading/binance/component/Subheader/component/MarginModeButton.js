import React, {useState,useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Button,
    ModalHeader,
    ModalBody,
    ModalFooter,
    NavItem,
    NavLink,
    Modal,
  } from 'reactstrap';
  import { Nav } from '../../../../../../components';
function MarginModeButton ({symbol,userstatus, position, openorder}){
    const {t, i18n} = useTranslation();
    const [modal, setModal] = useState(false)
    const [checked,setChecked] = useState('cross')
    const [confirm, setConfirm] = useState(true);
    const dispatch = useDispatch();
    const changeMarginMode = () => {
      if(!confirm){
        if(position[0].marginType ==='isolated' && checked ==='cross'){
          
          dispatch({
            type:"api/CHANGE_MARGIN_MODE",
            payload:{
              mode: 'CROSSED',
              symbol: symbol
            }
          })
        }else if(position[0].marginType ==='cross' && checked ==='isolated'){
          
          dispatch({
            type:"api/CHANGE_MARGIN_MODE",
            payload:{
              mode: 'ISOLATED',
              symbol: symbol
            }
          })
        }else{
          setChecked(position[0].marginType);
        }
        setModal(false)
      }else{
        setModal(false)
      }
    }
    useEffect(() => {
      if(position.length){
          if( (parseFloat(position[0].positionAmt) !==0) || openorder.length){
              setConfirm(true)
          }else{
              setConfirm(false)
          }
         
          setChecked(position[0].marginType)
      }else{
        setConfirm(false)
      }
      }, [position,openorder]);

    const getTitle =() =>{
        if(position.length){
            if(position[0].marginType ==='isolated'){
                return t('order.marginmode.isolated')
            }else{
                return t('order.marginmode.cross');
            }
        }else{
            return t('order.marginmode.cross')
        }
    }
    const handleChangeToCrossed =() => {
        setChecked('cross')
    }
    const handleChangeToIsolated = () => {
        setChecked('isolated')
    }

    const handleModal = () => {
      if(userstatus ==='cantrade'){
        setModal(true)
      }
    }
    const closeModal = () => {
      setModal(false)
    }


    return (
        <>
        <button
          id='marginType'
          onClick={handleModal}
          className="orderbtnd"
        >
            {getTitle()}
        </button>
        <Modal target='marginType' isOpen={modal}>
            <ModalHeader className="modlaheader">
                <span style={{fontWeight:"600"}}>
                {symbol} Margin Mode
                </span>
                <span className="fr" style={{cursor:"pointer"}}>
                <i
                className='fa fa-fw fa-close'
                aria-hidden='true'
                onClick={closeModal}
                />
                </span>
            </ModalHeader>
            <ModalBody>
            <Nav pills className='nav-justified'>
              <NavItem>
                <NavLink
                  className="marginmodelink"
                  active={checked === 'cross'}
                  onClick={handleChangeToCrossed}
                >
                  {t('order.marginmode.cross')}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className="marginmodelink"
                  active={checked === 'isolated'}
                  onClick={handleChangeToIsolated}
                >
                    {t('order.marginmode.isolated')}
                </NavLink>
              </NavItem>
            </Nav>
            {confirm ?<div className="marginwar"> The margin mode cannot be changed while you have an open order/position</div> :<></>}
            <div className="levdi">
            <Button
              className="margiok"
              disabled={confirm}
              onClick={changeMarginMode}
            >
              {t('order.marginmode.confirm')}
            </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="waringcont2">Cross Margin Mode: Share your margin balance across all open positions to avoid liquidation. In the event of liquidation you risk losing your full margin balance along with any remaining open positions.
            </div>
            <div className="waringcont2">
            Isolated Margin Mode: Manage your risk on individual positions by restricting the amount of margin allocated to each. If the margin ratio of a position reached 100%, the position will be liquidated. Margin can be added or removed to positions using this mode.
            </div>
          </ModalFooter>
        </Modal>
        </>

    )
}

export default React.memo(MarginModeButton);