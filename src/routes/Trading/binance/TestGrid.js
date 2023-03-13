import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import { RiCloseFill } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
import {Card, CardHeader} from '../../../components';
import { ToastContainer, toast } from 'react-toastify';
import { contentInfo,contentError,contentWarning, contentErrornoTitle,contentInfo2 } from '../../../components/Notification/Notification';
import Orderbook from './component/orderbook/Orderbook';
import RecenTrade from './component/recentTrade/RecentTrade';
import Chart from './component/Chart/Chart';
import Order from './component/Order/Order';
import Position from './component/Position/Position';
import Subheader from './component/Subheader/Subheader';
import OrderbookOption from './component/orderbook/component/OrderbookOption';
import Wallet from './component/Wallet/Wallet';
import MobGrid from './component/Mob/MobGrid';
import usePrevious from './component/usePrevious';
const ReactGridLayout = WidthProvider(RGL);
const intiialLayouts =  [{h:26, i: 'chart', minH: 6, minW: 6, moved: false, static: false, w:13, x:0, y:0},
                         {h:26, i: 'orderbook', minH: 7, minW: 3, moved: false, static: false, w:13, x:13, y:0},
                         {h:26, i: 'recents', minH: 5, minW: 5, moved: false, static: false, w:6, x:26, y:0},
                         {h:16, i: 'userInfo', minH: 3, minW: 3, moved: false, static: false, w:32, x:0, y:26}]


function generateLayout (){
    let a =intiialLayouts;
    try{
      a = JSON.parse(localStorage.getItem('futures-grid'));
    }catch(e){
      a = intiialLayouts;
    }
    
    let b =[];
    if(typeof a === 'object' && a !== null){
      _.forEach(intiialLayouts, item => {
        let num = a.findIndex(function(o){
          return o.i === item.i
        });
        if(num !== -1){
          b.push(a[num]);
          if(!checkAvail(a[num]))
            return  intiialLayouts;
        }
      })
      return b
    }else return intiialLayouts;
}
  
function checkAvail (local) {
    if(typeof local.w ==='number' && typeof local.y === 'number' && typeof local.h ==='number' && typeof local.x ==='number' && typeof local.minH ==='number' && typeof local.minW ==='number' && typeof local.moved ==='boolean' && typeof local.static ==='boolean'){
      return true;
    }else return false;
}

const TestGrid = (props) =>{
  const [width, setWidth] = useState(window.innerWidth)
  let eventSource = undefined;
  const [layout, setLayout] = useState(props.initialLayout)
  const {isLayout, mbc, userstatus, resetkey, toastApi, toastWeb, nick} = useSelector( state =>({
    isLayout: state.user.isLayout,
    mbc: state.user.mbc,
    userstatus: state.user.userstatus,
    resetkey: state.user.layoutReset,
    toastWeb: state.user.toastInfo.websocket,
    toastApi: state.user.toastInfo.api,
    nick: state.user.userInfo.nick
  }))
  const {chart, orderbook, recents, userInfo} = useSelector(state =>({
    chart: state.user.layoutlist.chart,
    orderbook: state.user.layoutlist.orderbook,
    recents: state.user.layoutlist.recents,
    userInfo: state.user.layoutlist.userInfo,
  }))
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const previousPath = usePrevious(props.location.pathname)
  const prevResetKey = usePrevious(resetkey)
  const prevLayouts = usePrevious({chart, orderbook, recents, userInfo})

  useEffect(() =>{
    dispatch({type:"home/SET_PAGE",payload:'trading'})
    dispatch({type:"user/SET_LAYOUTLIST",payload: layout})
    window.addEventListener('resize', updateWindowDimensions)
    updateWindowDimensions()
    _setPath(props.location.pathname)

    function updateWindowDimensions(){
      setWidth(window.innerWidth)
      if(mbc.check ==='not'){
        if(window.innerWidth>=1280){
          //lg
          dispatchMbc('done','lg')
        }else if(window.innerWidth>=768){
          //md
          dispatchMbc('done','md')
        }else {
          dispatchMbc('done','sm')
          dispatch({type:'trade/CHANGE_ORDER_MODE', payload:{isSingle:'dual'}})
          //sm
        }
      }else if(window.innerWidth<768 && mbc.mb !== 'sm'){
        dispatchMbc('done','sm')
        dispatch({type:'trade/CHANGE_ORDER_MODE', payload:{isSingle:'dual'}})
        dispatch({type:'user/CHANGE_BOOK_ORDER_MODE',payload:false })
        dispatch({type:'order/CLEAR_STATE'})
      }else if(window.innerWidth>=768 &&window.innerWidth<1280 && mbc.mb !== 'md'){
        dispatchMbc('done','md')
        dispatch({type:'user/CHANGE_BOOK_ORDER_MODE',payload:false })
        dispatch({type:'order/CLEAR_STATE'})
      }else if(window.innerWidth>1280 && mbc.mb !=='lg'){
        dispatchMbc('done','lg')
        dispatch({type:'user/CHANGE_BOOK_ORDER_MODE',payload:false })
        dispatch({type:'order/CLEAR_STATE'})
      }
    }

    return () =>{
      window.removeEventListener('resize', updateWindowDimensions)
      dispatch({type:"api/UNMOUNT_FUTURES"})
      dispatch({type:'websocket/UNMOUNT_WEBSCOKET_FUTURES'})
      if(eventSource !== undefined){
        eventSource.close();
      }
    }
  },[])
  
  useEffect(() =>{
    if(previousPath !== props.location.pathname && previousPath !== undefined){
      dispatch({type:'user/VIEW_FALSE'})
      dispatch({type:'user/USER_AUTH_SIMPLE'})
      dispatch({type:'trade/SET_PREV_SYMBOL'})
      dispatch({type:'order/CLEAR_STATE'})
      _reSetPath(props.location.pathname)
    }
  },[props.location.pathname])

  useEffect(() =>{

    if(prevResetKey !== resetkey){
        setLayout(intiialLayouts);
        localStorage.setItem('futures-grid', JSON.stringify(intiialLayouts))
    }else{
      if(prevLayouts.chart !== chart){
        if(chart){
          let item = intiialLayouts.find(el => el.i === 'chart');
          setLayout([
            ...layout,
            item
          ])
        }else{
          setLayout(layout.filter(({ i }) => i !== 'chart'))
        }
      }
      if(prevLayouts.orderbook !== orderbook){
        if(orderbook){
          let item = intiialLayouts.find(el => el.i === 'orderbook');
          setLayout([
            ...layout,
            item
          ])
        }else{
          setLayout(layout.filter(({ i }) => i !== 'orderbook'))
        }
      }
      if(prevLayouts.recents !== recents){
        if(recents){
          let item = intiialLayouts.find(el => el.i === 'recents');
          setLayout([
            ...layout,
            item
          ])
        }else{
          setLayout(layout.filter(({ i }) => i !== 'recents'))
        }
      }
      if(prevLayouts.userInfo !== userInfo){
        if(userInfo){
          let item = intiialLayouts.find(el => el.i === 'userInfo');

          setLayout([
            ...layout,
            item
          ])
        }else{
          setLayout(layout.filter(({ i }) => i !== 'userInfo'))
        }
      }
    }
  },[resetkey,chart,orderbook,recents,userInfo])
  
  useEffect(() =>{
    if(toastWeb.num !==0){
      toast.info(contentWarning(t(`toast.${toastWeb.type}`)+t(`toast.${toastWeb.side}`)+t(`toast.${toastWeb.status}`)))
    }
  },[toastWeb.num])

  useEffect(() =>{
    if(toastApi.num !==0){
      if(toastApi.status === 'SUCCESS'){
        toast.success(contentInfo(t('toast.SUCCESS')))
      }else if(toastApi.status ==='FAILURE'){
        toast.error(contentError(t('toast.FAILURE'),toastApi.message))
      }else if(toastApi.status === 'NOTITLE'){
        toast.error(contentErrornoTitle(toastApi.message))
      }else if(toastApi.status === 'MMSUCCESS'){
        toast.success(contentInfo2(t('toast.modechange')))
      }else if(toastApi.status ==='LSUCCESS'){
        toast.success(contentInfo2(t('toast.levechange')))
      }else if(toastApi.status === 'RESERVEMAX'){
        toast.error(contentErrornoTitle(t('toast.RESERVEMAX')))
      }else if(toastApi.status === 'RESERVENOSYM'){
        toast.error(contentErrornoTitle(t('toast.RESERVENOSYM')))
      }
    }
  },[toastApi.num])

  useEffect(() =>{
    if(nick !== '' && userstatus ==='cantrade'){
      eventSource = new EventSource(`https://www.bitcolabi.com/event?nick=${nick}`)

      eventSource.onmessage = (e) => {
        const event = JSON.parse(e.data)
        if(event.event_id ==='ordered' || event.event_id === 'canceled'){
          dispatch({type:'user/DELETE_RESERVE_ORDER', payload:event.message})
          
        }
      }
      eventSource.onopen = (e) =>{
        //console.log(e)
      }
      eventSource.onerror = (e) =>{
        //console.log(e)
      }

    }
    if(userstatus !== 'none' && userstatus !== 'guest'){
      dispatch({type:'user/SET_LOGGED_USER_OPTIOANL'})
    }
    
  },[userstatus])

  const dispatchMbc = (check, mb) =>{
    dispatch({
      type:"user/SET_MBC",
      payload:{
        check,
        mb
      }
    })
  }


  const _setPath = path => {
    let nowSymbol = path.substring(path.lastIndexOf('/') + 1);
    dispatch({type:"trade/SET_SYMBOL", payload:nowSymbol})
    dispatch({type:'api/INITIAL_API_DATA', payload:nowSymbol})
  };

  const _reSetPath = path => {
    let nowSymbol = path.substring(path.lastIndexOf('/') + 1);
    dispatch({type:"trade/SET_SYMBOL", payload:nowSymbol})
    dispatch({type:'websocket/CLEAR_ALL_DATA'})
    dispatch({type:'api/REINITIAL_API_DATA', payload:nowSymbol})
  }

  const onPutItem = item =>{
    dispatch({
      type:'user/PUT_LAYOUT',
      payload:item.i
    })
  }

  const generateDOM = useCallback(() => {
    return _.map(layout, l => {
      switch(l.i){
        case 'chart':{
          return (
            <Card key={l.i} style={{ height: '100%',borderRadius:"0"}}>
            <CardHeader className='titleheader draggableHandle'>
              <div>{t('chart')}</div>
              <RiCloseFill className="closebt" size={16} onClick={() =>onPutItem(l)}/>
            </CardHeader>
              <Chart/>
            </Card>
          )
        }
        case 'orderbook':{
          return (
            <Card key={l.i} style={{ height: '100%',borderRadius:"0"}}>
              <CardHeader className='titleheader draggableHandle'>
                <div style={{display:"flex"}}>{t('orderbook.title')}  <div style={{lineHeight:"19px", paddingLeft:"10px"}}className="draggableCancel"><OrderbookOption/></div></div>
                <RiCloseFill className="closebt" size={16} onClick={() =>onPutItem(l)}/>
              </CardHeader>
              <Orderbook/>
            </Card>
          )
        }
        case 'recents':{
          return ( 
            <Card key={l.i} style={{ height: '100%',borderRadius:"0"}}>
              <CardHeader className='titleheader draggableHandle'>
                <div>{t('recenttrades')}</div>
                <RiCloseFill className="closebt"size={16} onClick={() =>onPutItem(l)}/>
              </CardHeader>
              <RecenTrade
              />
            </Card>
          )
        }
        case 'userInfo':{
          return (
            <div key={l.i} className=''>
              <Position
              close = {true}
              min={985}
              activeMin={630}
              stopMin={670}
              reserveMin={730} 
              onClick={() => onPutItem(l)}/>
            </div>
          )
        }
        default: {
          return  <> </>
        }
      }
    });
  },[layout])

  const onLayoutChange = (layout) => {
    props.onLayoutChange(layout);
    setLayout(layout)
    localStorage.setItem('futures-grid', JSON.stringify(layout))
 };

  return(
    <>
    {isLayout ?
    <>
    {width>=1280? 
     <div className="futuregridlayout-log">
    <div className="futuregrid-sub">
      <Subheader/>
    </div>
    <ReactGridLayout
      {...props}
      layout={layout}
      onLayoutChange={onLayoutChange}
      useCSSTransforms={false}
    >
      {generateDOM()}
    </ReactGridLayout>
    <div  className="futureorder">
    <Order
      />
    </div>
    </div>
    : width >=768?
    
      <div className={mbc.bookorderMode ? "futuregridlayout-lognom":"futuregridlayout-log" }>
        <div className="futuregrid-sub">
          <Subheader/>
        </div>
        {mbc.bookorderMode ? <></>:
        <div className='futurechart'>
        <Card  style={{ height: '100%',borderRadius:"0"  }}>
          <Chart/>
        </Card>
        </div>
        }
        <div className='futureorderbook'>
        <Card style={{ height: '100%',borderRadius:"0"  }}>
          <CardHeader className='titleheader '>
          {t('orderbook.title')}  <div style={{lineHeight:"19px", paddingLeft:"10px"}}><OrderbookOption/></div>
          </CardHeader>
          <Orderbook />
        </Card>
        </div>
        <div className='futurerecent'>
          <Card  style={{ height: '100%',borderRadius:"0"  }}>
            <CardHeader className='titleheader '>
              {t('recenttrades')}
            </CardHeader>
            <RecenTrade/>
          </Card>
        </div>
        <div className='futureposition'>
          <Position 
          close = {false}
          min={905}
          activeMin={560}
          stopMin={610} 
          reserveMin={660}/>
        </div>
        <div  className="futureorder">
          {mbc.bookorderMode ?
           userstatus ==='cantrade' || userstatus === 'cannottrade' ?
           <div className="kwon-asset">
             <Card  style={{ height: '100%',borderRadius:"0", background: 'rgb(249 249 250)'}}>
               <div className='titleheader ' style={{backgroundColor:"inherit"}}>
                 {t('wallet.title')}
               </div>
               <Wallet
               />
             </Card>
           </div> :<></>
          :<Order/> 
          }
         
        </div>
      </div>
      :
      <MobGrid/>
      }
  </>
  :<></>}
    <ToastContainer
      position='bottom-right'
      autoClose={2500}
      draggable={false}
      hideProgressBar={true}
    />
  </>
    )

}


TestGrid.defaultProps = {
  autoSize: true,
  containerPadding: [0,0],
  rowHeight: 18,
  isDraggable : true,
  isDroppable: false,
  isResizable : true,
  preventCollision: false,
  draggableHandle: '.draggableHandle',
  draggableCancel: '.draggableCancel',
  transformScale:1,
  compactType: "vertical",
  onLayoutChange: function() {},
  verticalCompact: true,
  initialLayout: generateLayout(),
  cols: 32,
  margin: [4,4]
}

export default TestGrid;