import React, {useCallback}  from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from 'react-dropdown';
import {  UncontrolledDropdown,DropdownToggle} from 'reactstrap';
import { ExtendedDropdown, Nav } from '../../../../../../components';
import { RiSettings2Line } from 'react-icons/ri';
import Toggle from 'react-toggle';

const OrderbookOption = props => {
    const {t } = useTranslation();
    const dispatch = useDispatch();
    const {unit, orderbookMode, minUnit, minPricePrecision, mbc} = useSelector(state =>({
      unit: state.trade.orderbook.unit,
      orderbookMode: state.trade.orderbook.mode,
      minUnit: state.trade.exchangeInfo.minPrice,
      minPricePrecision: state.trade.exchangeInfo.pricePrecision,
      mbc: state.user.mbc
    }))
    const unitList = [{value: "0", label: minUnit.toString(),className: ''},
    {value: '1',label: (minUnit*10).toString(), className: ''},
    {value:'2',label: (minUnit*100).toString(), className: ''},
    {value: '3', label: (minUnit*1000).toString(),className: ''},
    {value: '4',label: (minUnit*10000).toString(), className: ''}
    ]

    const changeUnit = (value) => {
        dispatch({
          type: 'trade/SET_ORDERBOOK_DEPTH_UNIT',
          unit: minUnit*Math.pow(10,value),
          digit: Math.max(0,minPricePrecision-value),
        })
      }

  const handleToggle = useCallback((bool)=> {
        dispatch({type: 'user/CHANGE_BOOK_ORDER_MODE', payload: bool})
  },[dispatch])

  const changeOrderbookMode = useCallback((mode)=> {
    dispatch({type:'trade/CHANGE_ORDER_MODE', payload:{isSingle : mode}})
    dispatch({type:'CHANGE_ORDERBOOK_ORDER_VALUE', payload:{
      value: '', slider:''
    } })
  },[dispatch])  

    return(
        <div className={orderbookMode+'ordertype orderbookorder'}>
            <Nav className='ml-auto' style={{}}>
                <UncontrolledDropdown
                    style={{ outline: 'none !important' }}
                    nav
                    inNavbar
                    {...props}
                >
                <DropdownToggle nav style={{padding: 0}}>
                    <RiSettings2Line size={18} />
                </DropdownToggle>
            <ExtendedDropdown  style={{ outline: 'none', zIndex: '1020' }}>
              <ExtendedDropdown.Section className='navbarsetting navbarorder'>
              {t('orderbook.option')}
              </ExtendedDropdown.Section>
              <ExtendedDropdown.Section className='orderbooksection'>
                <div className='navbarseKVNLS2'> {t('orderbook.group')}</div>
                  {(unit) !==''?
                  <div className='navb-brand'>
                  <Dropdown 
                    arrowClassName='unit-drop-arrow'
                     controlClassName="unit-drop-control"
                    className='lang-drop-root'
                    placeholderClassName='lang-drop-place'
                    menuClassName='unit-drop-menu'
                    options={unitList}
                    value ={unit.toString()}
                    onChange={value => changeUnit(value.value)}
                  />
                  </div>
                  :<></>}
                <div className='navbarseKVNLS2' style={{ paddingTop: '12px' }}>
                  {t('orderbook.columns')}
                </div>
                <div className="containerOuter">
                <div className="containdd" >
                  
                  <input type='radio'  className="hidden-radio" readOnly={true} checked={orderbookMode ==='single1'} />
                  <label className="entry" onClick={()=>changeOrderbookMode('single1')} >
                    <div className="radio-circle"/>
                     <div className="radio-labels">
                      {t('orderbook.single')} A
                     </div>
                  </label>
                  
                 
                  <input type='radio'  className="hidden-radio" readOnly={true} checked={orderbookMode ==='single2'} />
                  <label className="entry" onClick={()=>changeOrderbookMode('single2')} >
                    <div className="radio-circle"/>
                     <div className="radio-labels">
                      {t('orderbook.single')} B
                     </div>
                  </label>
                  
                  <input type='radio'  className="hidden-radio" readOnly={true} checked={orderbookMode ==='dual'} />
                  <label className="entry" onClick={()=> changeOrderbookMode('dual')}>
                    <div className="radio-circle"/>
                     <div className="radio-labels">
                      {t('orderbook.dual')}
                     </div>
                  </label>
                  <div className="highlightradio"></div>
                  <div className="overlay"></div>
                </div>
                </div>
                {mbc.mb ==='md'?
                 <>
                <div className='navbarseKVNLS2' >
                {t('orderbook.ordermode')}
                </div>
                <div className='navb-brand'>
                  <Toggle
                    checked={mbc.bookorderMode}
                    onChange={() =>handleToggle(!mbc.bookorderMode)}
                    icons={false}
                  />
                </div>
                </>:<></>}
              </ExtendedDropdown.Section>
            </ExtendedDropdown>
          </UncontrolledDropdown>
        </Nav>
      </div>
    )
}

export default OrderbookOption;