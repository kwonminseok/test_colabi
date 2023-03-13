import React, {useMemo, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {List, AutoSizer} from 'react-virtualized'
import { NavLink as Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import Symbollist from './Symbollist'


function priceFormatter(cell) {
    if(cell>0){
        return  <div  className="listpercent" style={{color:"#58b589", fontWeight:"600"}}>{ cell }%<span style={{paddingRight:"15px"}}></span></div>
    }else if(cell<0){
        return  <div className="listpercent" style={{color:"#d9304e", fontWeight:"600"}}>{ cell }%<span style={{paddingRight:"15px"}}></span></div>
    }else {
        return  <div className="listpercent">{ cell }%<span style={{paddingRight:"15px"}}></span></div>
    }
}

function filterData(data,filter,active){
  let filterdata;
  if(active){
    filterdata = data.filter(l => l.active === true)
  }else{
    filterdata = data.filter(l => l.active === true || l.active === false);
  }
  if(filter.symbol !== ''){
    var fs = (filter.symbol).toUpperCase()
    filterdata = filterdata.filter(l => (l.symbol).includes(fs))
  }

  if(filter.price !== 'none'){
    if(filter.price === 'up'){
      //up
      filterdata.sort(function(a,b) {
        return a.lastPrice - b.lastPrice;
      })
    }else{
      filterdata.sort(function(a,b){
        return b.lastPrice- a.lastPrice
      })
    }
  }else if(filter.percent !== 'none'){
    if(filter.percent === 'up'){
      filterdata.sort(function(a,b){
        return a.priceChangePercent- b.priceChangePercent
      })
    }else{
      filterdata.sort(function(a,b){
        return b.priceChangePercent- a.priceChangePercent
      })
    }
  }

  return filterdata;

}


const liststyle = {overflowY:false, overflowX:true}

const SymbolTable = (props) =>{
    const {active} = props;
    const dispatch = useDispatch()
    const {data, useOptional, filters} = useSelector(state => ({
        data:state.websocket.futuresdaily,
        useOptional:state.user.useOptional.optional,
        filters: state.user.useOptional.filter
    }))
    const list = useRef();
    

      const handleScroll = e => {
        const { scrollTop, scrollLeft } = e.target;
        const { Grid } = list.current;
        Grid.handleScrollEvent({ scrollTop, scrollLeft });
      };

      const handleClick = (e, symbol) =>{
        e.preventDefault();
        var a = useOptional.indexOf(symbol+",")
        if(a !== -1){
          dispatch({type:"user/UPDATE_USER_OPTIONAL",payload:useOptional.replace(symbol+",","")})
        }else{
          dispatch({type:"user/UPDATE_USER_OPTIONAL",payload:useOptional.concat(symbol,",")})
        }
      }

    const rowRenderer = ({ index, style,key }) => {
        const link = `/trade/binance/${symboldata[index].symbol}`
            return (
                <div  style={style}  key={key} className='listColumnwrap'>
                      <Link to={link}  className="listColumnlink">
                          <Symbollist
                              symbol ={symboldata[index].symbol}
                              list={useOptional}
                              handleClick={handleClick}
                          />
                          <div className="listlast">{symboldata[index].lastPrice}</div>
                          {priceFormatter(symboldata[index].priceChangePercent)}
                      </Link>
                </div>
              );
    };


    const symboldata = useMemo(() => filterData(data,filters,active),[data,filters,active])
    

      return(
          <>
          {data.length?
                  <AutoSizer>
                  {({height, width }) => (
                     <Scrollbars
                     onScroll={handleScroll}
                     style={{ height, width }}
                    >
                   <List
                    rowCount={symboldata.length}
                    width={width}
                    height={height}
                    rowHeight={38}
                    ref={list}
                    style={liststyle}
                    data={symboldata}
                    rowRenderer={rowRenderer}
                />
                    
                    </Scrollbars>
                  )}
                </AutoSizer>
            :<></>
            }
          </>
      )

}

export default SymbolTable;