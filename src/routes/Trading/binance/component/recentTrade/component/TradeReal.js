import React,{ createRef } from 'react';
import { connect } from 'react-redux';
import {List, AutoSizer} from 'react-virtualized'
import { Scrollbars } from 'react-custom-scrollbars';

const liststyle = {overflowY:false, overflowX:false}
class TradeReal extends React.Component {
  list = createRef();

  handleScroll = e => {
    const { scrollTop, scrollLeft } = e.target;
    const { Grid } = this.list.current;
    Grid.handleScrollEvent({ scrollTop, scrollLeft });
  };

  timeConvert (timestamp) {
    let date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB');
  }

  rowRenderer = ({ index, style,key }) => {
    const data = this.props.unit === 'real'? this.props.recent: this.props.unit ==='1s'? this.props.recent1s: this.props.recent1m
    const font = data[index].m === true
            ? 'tradesell'
            : 'tradebuy'
    return (
      <div  style={style}  key={key} className='flex'>
            <span className={"flex-1 text-left recentCREIp "+font}>{data[index].p}</span>
            <span className={"flex-1 text-right "+font}>{parseFloat(data[index].q).toFixed(this.props.sizedigit)}</span>
            <span className={"flex-1 text-right "+font}>{this.timeConvert(data[index].T)}</span>
      </div>
    );
  };


  render () {
    const {recent,recent1s, recent1m,unit, mbc} = this.props;
    const data = unit === 'real'? recent: unit ==='1s'? recent1s: recent1m
    return (
     <>
        {recent.length && mbc.check ==='done'?
        <>
        <AutoSizer>
          {({height, width }) => (
             <Scrollbars
             onScroll={this.handleScroll}
             style={{ height, width }}
             autoHide
            >
            <List
              rowCount={data.length}
              width={width}
              height={height}
              rowHeight={20}
              ref={this.list}
              style={liststyle}
              data={data}
              rowRenderer={this.rowRenderer}
            />
            </Scrollbars>
          )}
        </AutoSizer>
        </>
          :<></>}
        </>
    );
  }
}

const mapStateToProps = ({ websocket, user, recents,trade }) => ({
  recent: websocket.aggtrade,
  recent1s: websocket.aggtrade1s,
  recent1m: websocket.aggtrade1m,
  unit: recents.unit,
  mbc: user.mbc,
  sizedigit: trade.exchangeInfo.quantityPrecision,
});

export default connect(mapStateToProps, undefined)(TradeReal);
