import React from 'react';
import _ from "lodash";
import { connect } from 'react-redux';
import RGL, { WidthProvider } from "react-grid-layout";
import { RiCloseFill } from "react-icons/ri";
import { withTranslation } from 'react-i18next';
import {Card, CardHeader} from '../../../components';
import {putLayout, setLayoutlist, setMbc, changebookOrderMode} from '../../../store/modules/user';
import { setSymbol,changeOrderMode,setPrevSymbol } from '../../../store/modules/trade';
import { unMountWebsocketFutures,clearAllData } from '../../../store/modules/websocket';
import { initialApiData,reinitialApiData, unMountFutures } from '../../../store/modules/api';
import Orderbook from './component/orderbook/Orderbook';
import RecenTrade from './component/recentTrade/RecentTrade';
import Chart from './component/Chart/Chart';
// import Option from './component/Option/Option';
import Order from './component/Order/Order';
import Position from './component/Position/Position';
import MinCon from './component/MinCon';
import Mob from './component/Mob/Mob';
import MoMargin from './component/MoView/MoMargin';
import MoOrder from './component/MoView/MoOrder';
import Subheader from './component/Subheader/Subheader';
import Subtitle from './component/Mob/component/Subtitle';
import OrderbookOption from './component/orderbook/component/OrderbookOption';
import Wallet from './component/Wallet/Wallet';
const ReactGridLayout = WidthProvider(RGL);
const intiialLayouts =  [{h:26, i: 'chart', minH: 6, minW: 6, moved: false, static: false, w:13, x:0, y:0},
                         {h:26, i: 'orderbook', minH: 7, minW: 3, moved: false, static: false, w:13, x:13, y:0},
                         {h:26, i: 'recents', minH: 5, minW: 5, moved: false, static: false, w:6, x:26, y:0},
                        //  {h:16, i: 'alarms', minH: 3, minW: 3, moved: false, static: false, w:10, x:0, y:26},
                         {h:16, i: 'userInfo', minH: 3, minW: 3, moved: false, static: false, w:22, x:10, y:26}]
const serverEvent = new EventSource(`https://www.bitcolabi.com/event?nick=fedfg`)
class TestGrid extends React.Component{
    static defaultProps = {
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
        };

    constructor(props){
        super(props);
        this.state ={layout: this.props.initialLayout}
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        // this.eventSource = new EventSource("/api/v2/fedfg");
    
      }

    componentDidMount(){
        this.props.setLayoutlist(this.state.layout)
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions.bind(this))
        this._setPath(this.props.location.pathname); //set symbol
      
        // this.eventSource.addEventListener('push', event => {
        //   console.log(event.data);
        // });
        // this.eventSource.addEventListener('message', event => {
        //   console.log(event.data);
        // });
        serverEvent.onmessage = (e) => {
          const event = JSON.parse(e.data)
          console.log(event)
          // event.consumer_id = eventBig.consumer_id.toString()
          // event.event_id = eventBig.event_id.toString()
          // console.log(event.consumer_id, ' & ', event.event_id)
          // updateData(event)
        }
    
    }

    componentDidUpdate(prevProps){
      if(this.props.chart !== prevProps.chart){
        if(this.props.chart){
          let item = intiialLayouts.find(el => el.i === 'chart');
          this.setState(prevState =>{
            return {
              layout: [item,...prevState.layout]
            }
          })
        }else{
          this.setState(prevState => {
            return {
              layout:prevState.layout.filter(({ i }) => i !== 'chart')
            };
          });
        }
      }
      if(this.props.orderbook !== prevProps.orderbook){
        if(this.props.orderbook){
          let item = intiialLayouts.find(el => el.i === 'orderbook');
          this.setState(prevState =>{
            return {
              layout: [item,...prevState.layout]
            }
          })
        }else{
          this.setState(prevState => {
            return {
              layout:prevState.layout.filter(({ i }) => i !== 'orderbook')
            };
          });
        }
      }
      if(this.props.recents !== prevProps.recents){
        if(this.props.recents){
          let item = intiialLayouts.find(el => el.i === 'recents');
          this.setState(prevState =>{
            return {
              layout: [item,...prevState.layout]
            }
          })
        }else{
          this.setState(prevState => {
            return {
              layout:prevState.layout.filter(({ i }) => i !== 'recents')
            };
          });
        }
      }
      // if(this.props.alarms !== prevProps.alarms){
      //   if(this.props.alarms){
      //     let item = intiialLayouts.find(el => el.i === 'alarms');
      //     this.setState(prevState =>{
      //       return {
      //         layout: [item,...prevState.layout]
      //       }
      //     })
      //   }else{
      //     this.setState(prevState => {
      //       return {
      //         layout:prevState.layout.filter(({ i }) => i !== 'alarms')
      //       };
      //     });
      //   }
      // }
      if(this.props.userInfo !== prevProps.userInfo){
        if(this.props.userInfo){
          let item = intiialLayouts.find(el => el.i === 'userInfo');
          this.setState(prevState =>{
            return {
              layout: [item,...prevState.layout]
            }
          })
        }else{
          this.setState(prevState => {
            return {
              layout:prevState.layout.filter(({ i }) => i !== 'userInfo')
            };
          });
        }
      }
    }

    UNSAFE_componentWillReceiveProps (nextProps) {
      if (nextProps.location.pathname !== this.props.location.pathname) {
        this.props.setPrevSymbol()
        this._reSetPath(nextProps.location.pathname)
      }
    }

    componentWillUnmount(){
      window.removeEventListener("resize", this.updateWindowDimensions.bind(this)) 
      this.props.unMountFutures();
      this.props.unMountWebsocketFutures();
    }

    updateWindowDimensions(){
        this.setState({
          width: window.innerWidth
        })
        if(this.props.mbc.check ==='not'){
          if(window.innerWidth>=1280){
            //lg
            this.props.setMbc({check: 'done', mb: 'lg'})
          }else if(window.innerWidth>=768){
            //md
            this.props.setMbc({check: 'done', mb: 'md'})
          }else {
            this.props.setMbc({check: 'done', mb: 'sm'})
            this.props.changeOrderMode({isSingle: 'dual'})
            //sm
          }
        }else if(window.innerWidth<768 && this.props.mbc.mb !=='sm'){
          this.props.changeOrderMode({isSingle: 'dual'})
          this.props.setMbc({check: 'done', mb: 'sm'})
          this.props.changebookOrderMode(false)
        }else if(window.innerWidth>=768 &&window.innerWidth<1280 && this.props.mbc.mb !== 'md'){
          this.props.setMbc({check: 'done', mb: 'md'})
          this.props.changebookOrderMode(false)
        }else if(window.innerWidth>1280 && this.props.mbc.mb !=='lg'){
          this.props.setMbc({check: 'done', mb: 'lg'})
          this.props.changebookOrderMode(false)
        }
    }

    _setPath = path => {
      let nowSymbol = path.substring(path.lastIndexOf('/') + 1);
      this.props.setSymbol(nowSymbol);
      this.props.initialApiData(nowSymbol);
    };

    _reSetPath = path => {
      console.log(path)
      let nowSymbol = path.substring(path.lastIndexOf('/') + 1);
      console.log(nowSymbol)
      this.props.setSymbol(nowSymbol);
      this.props.clearAllData();
      this.props.reinitialApiData(nowSymbol);
    }


      generateDOM() {
        const {t} = this.props;
        return _.map(this.state.layout, l => {
          switch(l.i){
            case 'chart':{
              return (
                <Card key={l.i} style={{ height: '100%',borderRadius:"0"}}>
                <CardHeader className='titleheader draggableHandle'>
                  <div>{t('chart')}</div>
                  <RiCloseFill className="closebt" size={16} onClick={this.onPutItem.bind(this,l)}/>
                
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
                    <RiCloseFill className="closebt" size={16} onClick={this.onPutItem.bind(this,l)}/>
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
                    <RiCloseFill className="closebt"size={16} onClick={this.onPutItem.bind(this,l)}/>
                  </CardHeader>
                  <RecenTrade
                  
                  />
                </Card>
              )
            }
            // case 'alarms':{
            //   return (
            //     <Card key={l.i} style={{ height: '100%',borderRadius:"0"  }}>
            //       <CardHeader className='titleheader draggableHandle'>
            //         <div>{t('orderbook.title')}</div>
            //         <RiCloseFill className="closebt" size={16} onClick={this.onPutItem.bind(this,l)}/>
            //       </CardHeader>
            //       <Option/>
            //     </Card>
            //   )
            // }
            case 'userInfo':{
              return (
                <div key={l.i} className=''>
                <Position
                close = {true}
                min={955}
                activeMin={590}
                stopMin={640} 
                onPut={this.onPutItem.bind(this,l)}/>
                </div>
              )
            }
            default: {
              return  <div key={l.i} style={{backgroundColor:"#153044"}} > </div>
            }
          }
        });
      }

    
      onPutItem = item => {
        // console.log(item)
        // this.setState(prevState => {
        //   return {
        //     layout:prevState.layout.filter(({ i }) => i !== item.i)
        //   };
        // });
        this.props.putLayout(item.i)
      };
    
      onLayoutChange = (layout) => {
         this.props.onLayoutChange(layout);
         this.setState({ layout });
         localStorage.setItem('futures-grid', JSON.stringify(layout))
      };
    

      // handleToggle = (what, bool) => {
      //     if(bool){
      //         this.setState(prevState => {
      //             return{
      //               layout:prevState.layout.filter(({ i }) => i !== what)
      //             }
      //         })
      //         this.props.putLayout(what)
      //     }else{
      //         let item = intiialLayouts.find(el => el.i === what);
      //         console.log(item)
      //         this.setState(prevState =>{
      //             return {
      //                 layout: [item,...prevState.layout]
      //             }
      //         })
      //         this.props.putLayout(what)
      //     }
      // }


    render(){
        const { t, isLayout,userstatus,mbc} = this.props;
      return(
        <>
        {isLayout ?
        <>
        {this.state.width>=1280? 
         <div className="futuregridlayout-log">
        <div className="futuregrid-sub">
          <Subheader
          view = {true}/>
        </div>
        <ReactGridLayout
          {...this.props}
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          useCSSTransforms={false}
        >
          {this.generateDOM()}
        </ReactGridLayout>
        <div  className="futureorder">
        <Order
         // toast ={toast}
          />
        </div>
        </div>
        : this.state.width >=768?
        
          <div className={mbc.bookorderMode ? "futuregridlayout-lognom":"futuregridlayout-log" }>
            <div className="futuregrid-sub">
              <Subheader
              view = {false}/>
            </div>
            {mbc.bookorderMode ? <></>:
            <div className='futurechart'>
            <Card  style={{ height: '100%',borderRadius:"0"  }}>
              <CardHeader className='titleheader '>
                <div>{t('chart')}</div>
              </CardHeader>
              <Chart />
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
              min={875}
              activeMin={520}
              stopMin={570} />
            </div>
            <div  className="futureorder">
              {mbc.bookorderMode ?
               userstatus ==='cantrade' || userstatus === 'cannottrade' ?
               <div className="kwon-asset">
                 <Card  style={{ height: '100%',borderRadius:"0", background: 'rgb(249 249 250)'}}>
                   <div className='titleheader ' style={{backgroundColor:"inherit"}}>
                     자산
                   </div>
                   <Wallet/>
                 </Card>
               </div> :<></>
              :<Order/> 
              }
             
            </div>
          </div>
          :
          <div className="futuregridlayout-log">
          <div className="futuregrid-test1" >
          <Subtitle
          />
          </div>
          <div className='futuregrid-test2'>
            <MinCon/>
          </div>
          <div className="futuregrid-test5">
          
              <MoOrder/>
            
          </div>
          <div className='futuregrid-test3'>
            <Mob/>
          </div>
          <div className="futuregrid-test4">
              <MoMargin/>
          </div>
          {/* <div className="futuregrid-test5">

          </div> */}
          </div>}
      </>
      :<></>}
      </>
        )
    }
}


  
  function generateLayout (){
    let a =intiialLayouts;
    try{
      a = JSON.parse(localStorage.getItem('futures-grid'));
    }catch(e){
      //a = intiialLayouts;
      console.log(e)
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
      console.log(b)
      return b
    }else return intiialLayouts;
  }
  
  function checkAvail (local) {
    if(typeof local.w ==='number' && typeof local.y === 'number' && typeof local.h ==='number' && typeof local.x ==='number' && typeof local.minH ==='number' && typeof local.minW ==='number' && typeof local.moved ==='boolean' && typeof local.static ==='boolean'){
      return true;
    }else return false;
  }
  

const mapStateToProps = ({ user,trade }) => ({
    isLayout: user.isLayout,
    chart: user.layoutlist.chart,
    orderbook: user.layoutlist.orderbook,
    recents: user.layoutlist.recents,
    alarms: user.layoutlist.alarms,
    userInfo: user.layoutlist.userInfo,
    trade: trade,
    mbc: user.mbc,
    userstatus: user.userstatus
});
   
const mapDispatchToProps = dispatch => ({
    putLayout: (i) => dispatch(putLayout(i)),
    setLayoutlist: (layout) => dispatch(setLayoutlist(layout)),
    setSymbol: (symbol) => dispatch(setSymbol(symbol)),
    initialApiData: (symbol) => dispatch(initialApiData(symbol)),
    reinitialApiData: (symbol) =>dispatch(reinitialApiData(symbol)),
    setPrevSymbol: () => dispatch(setPrevSymbol()),
    unMountFutures: () => dispatch(unMountFutures()),
    unMountWebsocketFutures: () => dispatch(unMountWebsocketFutures()),
    setMbc: info => dispatch(setMbc(info)),
    changebookOrderMode: value => dispatch(changebookOrderMode(value)),
    changeOrderMode: value => dispatch(changeOrderMode(value)),
    clearAllData: () => dispatch(clearAllData())
});
  


export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TestGrid));