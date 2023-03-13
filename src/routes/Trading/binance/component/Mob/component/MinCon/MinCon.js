import React, {useState} from 'react';
import { NavItem, TabPane, Nav, NavLink, TabContent } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import Orderbook from '../../../orderbook/Orderbook';
import RecenTrade from '../../../recentTrade/RecentTrade';
import Chart from '../../../Chart/Chart';
import Dropdown from 'react-dropdown';
import { BsArrowsAngleContract,BsArrowsAngleExpand } from "react-icons/bs";
const MinCon = () => {
    const [active, setActive] = useState('chart');
    const dispatch = useDispatch();
    const minUnit = useSelector(state => state.trade.exchangeInfo.minPrice)
    const orderbookMode = useSelector(state => state.trade.orderbook.mode)
    const minPricePrecision = useSelector(state => state.trade.exchangeInfo.pricePrecision)
    const unit = useSelector(state => state.trade.orderbook.unit)
    const isCOR = useSelector(state => state.user.moblist.isCOR)
    const unitList = [{value: "0", label: minUnit.toString(),className: ''},
    {value: '1',label: (minUnit*10).toString(), className: ''},
    {value:'2',label: (minUnit*100).toString(), className: ''},
    {value: '3', label: (minUnit*1000).toString(),className: ''},
    {value: '4',label: (minUnit*10000).toString(), className: ''}
    ]



    const onClickChangeActive = status => {
        if (active !== status) {
            setActive(status)
        }
      };

      const changeUnit = (value) => {
        dispatch({
          type: 'trade/SET_ORDERBOOK_DEPTH_UNIT',
          unit: minUnit*Math.pow(10,value),
          digit: Math.max(0,minPricePrecision-value),
        })
      }
      
      const onClickChangeIsCOR = () => {
          dispatch({
              type: 'user/CHANGE_MOBLIST_ISCOR',
              payload: !isCOR
          })
      }


        return(
            <div className="future-mob-container">
                <Nav tabs className="future-mob-header">
                    <NavItem>
                        <NavLink
                        className={
                            classnames({ active: active === 'chart' }) +
                            ' ordertab ' +
                            classnames({ active: active === 'chart' })
                        }
                        onClick={() => onClickChangeActive('chart')}
                        >
                        Chart
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                        className={
                            classnames({ active: active === 'orderbook' }) +
                            ' ordertab ' +
                            classnames({ active: active === 'orderbook' })
                        }
                        onClick={() => onClickChangeActive('orderbook')}
                        //tabId='stop' className=" ordertab "
                        >
                        Orderbook
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                        className={
                            classnames({ active: active === 'recents' }) +
                            ' ordertab ' +
                            classnames({ active: active === 'recents' })
                        }
                        onClick={() => onClickChangeActive('recents')}
                        //tabId='reservation' className=" ordertab "
                        >
                        Recents
                        </NavLink>
                    </NavItem>
                    <div style={{flex:"1", textAlign:"end", paddingRight:"7px", color:"#111"}}>
                        {isCOR? <BsArrowsAngleContract onClick={onClickChangeIsCOR} size={15}/>:<BsArrowsAngleExpand onClick={onClickChangeIsCOR} size={15}/>}
                    </div>
                </Nav>
                {isCOR?
                <TabContent activeTab={active} style={{flex:"1 1 0%", height:"325px"}}>
                    <TabPane tabId='chart' style={{ marginTop: '5px',height:"100%" }}>
                       <Chart/>
                    </TabPane>
                    <TabPane tabId='orderbook' style={{ marginTop: '5px',height:"100%"}}>
                        <div style={{display:"flex", flexDirection:"column",height:"100%"}}>
                        <div className="flex">
                        <div className="flex flex-2" style={{marginLeft:"20px"}}>
                            <div 
                            className={'mob-orderbook '+  classnames({ active: orderbookMode === 'single2' })}
                            onClick={()=> dispatch({type:'trade/CHANGE_ORDER_MODE', payload:{isSingle : 'single2'}})}
                            > single</div>
                            <div 
                            className={'mob-orderbook '+  classnames({ active: orderbookMode === 'dual' })}
                            onClick={()=> dispatch({type:'trade/CHANGE_ORDER_MODE', payload:{isSingle : 'dual'}})}
                            >dual</div>
                        </div>
                            <div className="flex-1" style={{textAlign: '-webkit-center'}}> 
                            <Dropdown 
                                arrowClassName='orderbook-drop-arrow'
                                controlClassName="unit-drop-control"
                                className='orderbook-drop-root'
                                placeholderClassName='lang-drop-place'
                                menuClassName='unit-drop-menu'
                                options={unitList}
                                value ={unit.toString()}
                                onChange={value => changeUnit(value.value)}
                            />
                            </div>
                        </div>
                       
                        <Orderbook/>
                        </div>
                    </TabPane>
                    <TabPane tabId='recents' style={{  marginTop: '5px',height:"100%" }}>
                        <RecenTrade
                        />
                    </TabPane>
                </TabContent>
                :<></>}
            </div>
        )

}



export default MinCon;