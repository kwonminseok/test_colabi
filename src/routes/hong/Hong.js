import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';


function priceFormatter(cell, row) {
    if(cell>0){
        return  <span style={{color:"#58b589", fontWeight:"600"}}>{ parseFloat(cell).toFixed(4) }%</span>
    }else if(cell<0){
        return  <span style={{color:"#d9304e", fontWeight:"600"}}>{ parseFloat(cell).toFixed(4) }%</span>
    }else {
        return  <span >{ parseFloat(cell).toFixed(4) }%</span>
    }
  }

  function priceFormatter2(cell, row) {
    if(cell>0){
        return  <span style={{color:"#58b589"}}>{ parseFloat(cell).toFixed(2) }%</span>
    }else if(cell<0){
        return  <span style={{color:"#d9304e"}}>{  parseFloat(cell).toFixed(2) }%</span>
    }else {
        return  <span >{ cell }%</span>
    }
  }


const Hong = () =>{
    const data = useSelector(state => state.hong.data)
    const dispatch = useDispatch();
    useEffect(() =>{
        dispatch({
            type:"hong/GET_MARK"
        })
    },[])

    
    

    const columns = [{
        dataField: 'symbol',
        text: '종목'
      }, {
        dataField: 'lastPrice',
        text: '현재가'
      },
      {
        dataField: 'weightedAvgPrice',
        text: '가중치평균가',
      }, {
        dataField: 'priceChangePercent',
        text: '가격변동',
        sort: true,
        formatter: priceFormatter2
      },
      {
        dataField: 'lastFundingRate',
        text: '펀딩비',
        sort: true,
        formatter: priceFormatter
      },
    ];


    return(
        <div>
            {data.length?
            <BootstrapTable
                classes="table-responsive-lg"
                keyField='symbol'
                data={ data }
                columns={ columns }
            />
            :<div>ㅎㅇ</div>}
        </div>
    )

}

export default Hong;