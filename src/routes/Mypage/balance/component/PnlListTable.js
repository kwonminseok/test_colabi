import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Dropdown from 'react-dropdown';
import SyncLoader from "react-spinners/SyncLoader";
import Propfitdiv from './Propfitdiv'
import ProLossdiv from './ProLossdiv'
import Lossdiv from './Lossdiv';
import usePrevious from './usePrevios';
const pageSize =15;
const pageIndexSize = 5;

function calcPaginationCount(currentPageIndex, lastPageIndex, pageCount) {
    if(currentPageIndex === lastPageIndex){
        return pageCount%pageIndexSize +1
    }else {
        return 5;
    }
}

function calcAll(income, contract){
    let profit =0;
    let loss = 0;
    if(contract === 'ALL'){
        _.forEach(income, item => {
            // if(item.timestamp>= this.props.startPeriod){
                _.forEach(item.incomes, item2 =>{
                    if(item2.income>0){
                        profit += item2.income
                    }else {
                        loss += item2.income
                    }
                })
            // }
        })
    }else{
        _.forEach(income,item => {
            // if(item.timestamp>= this.props.startPeriod){
                let a = _.findIndex(item.incomes, function(o){
                    return o.symbol === contract
                })
                if(a !== -1){
                    if(item.incomes[a].income>0){
                        profit += item.incomes[a].income;
                    }else loss +=item.incomes[a].income;
                }
            // }
        })
    }
    return [parseFloat(profit).toFixed(2),parseFloat(loss).toFixed(2), parseFloat(profit+loss).toFixed(2)];
}

function generateDOM (income, contract,all,currentPage,period) {
    let a = all[2];
    let before = a;
    let after = a;
    let count =0;
    if(period ==='day' && income.length){
        if(contract === "ALL"){
            return _.map(income[0].incomes, (item,index) =>{
                if(index>=currentPage*pageSize){
                    if(count<pageSize){
                        count++;
                        return (
                            <tr key={item.symbol} className="bcol-table-tr">
                                <td>{item.symbol}</td>
                                {dayIncom(item.income)}
                                {/* <td>{parseFloat(before).toFixed(2)}</td> */}
                            </tr>
                        )
                    }
                }
            })
        }else{
            return _.map(income[0].incomes, item => {
                if(item.symbol === contract){
                    return (
                        <tr key={item.timestamp} className="bcol-table-tr">
                            <td>{item.date}</td>
                            <td>{parseFloat(item.income).toFixed(2)}</td>
                            {/* <td>{parseFloat(before).toFixed(2)}</td> */}
                        </tr> 
                    )
                }
            })
        }
    }else{
        if(contract === "ALL"){
            return _.map(income, (item,index) => {
                before = after;
                // if(item.timestamp>this.props.startPeriod){
                    let total = 0;
                    _.forEach(item.incomes, item2 =>{
                       total+= item2.income
                    })
                    after = before-total;
                    if(index>=currentPage*pageSize){
                        if(count<pageSize){
                            count++;
                        return (
                            <tr key={item.timestamp} className="bcol-table-tr">
                                <td>{item.date}</td>
                                <td>{parseFloat(total).toFixed(2)}</td>
                                <td>{parseFloat(before).toFixed(2)}</td>
                            </tr>
                        )
                        }
                    }
                // }
            })
        }else{
            return _.map(income, (item,index) =>{
                before = after;
                // if(item.timestamp> this.props.startPeriod){
                    let a = _.findIndex(item.incomes, function(o){
                        return o.symbol === contract
                    })
                    // if(a !==-1){
                        after = before-item.incomes[a].income;
                        if(index>=currentPage*pageSize){
                            if(count<pageSize){
                                count++;
                        return (
                            <tr key={item.timestamp} className="bcol-table-tr">
                                <td>{item.date}</td>
                                <td>{parseFloat(item.incomes[a].income).toFixed(2)}</td>
                                <td>{parseFloat(before).toFixed(2)}</td>
                            </tr> 
                        )
                            }
                        }
                    // }
                // }
            })
        }
    }
    
    
}

function dayIncom(num){
    if(num>0){
        return <td className="daypnl dypnl-win">+ {parseFloat(num).toFixed(2)}</td>
    }else if(num <0){
        return <td className="daypnl daypnl-loo">- {parseFloat(num).toFixed(2)}</td>
    }else{
        return <td className="daypnl"> {parseFloat(num).toFixed(2)}</td>
    }
}


// function usePrevious(value) {
//     // The ref object is a generic container whose current property is mutable ...
//     // ... and can hold any value, similar to an instance property on a class
//     const ref = useRef();
    
//     // Store current value in ref
//     useEffect(() => {
//       ref.current = value;
//     }, [value]); // Only re-run if value changes
    
//     // Return previous value (happens before update in useEffect above)
//     return ref.current;
// }


const PnlListTable = (props) =>{
    const {period, startPeriod, startDate, endDate, income, contactlist, isReady } = props;
    const prevContactlist = usePrevious(contactlist)
    const prevIncome = usePrevious(income)
    const [page, setPage] = useState({
        currentPage: 0,
        currentPageIndex: 0,
        lastPageIndex: 0,
        pageCount: 0,
    })
    const {currentPage,currentPageIndex,lastPageIndex,pageCount}=page;
    const { t } = useTranslation();
    const [nowContract, setNowContract] = useState('ALL')
    const [incomes, setIncomes] = useState(income)

    useEffect(() =>{
        if(prevContactlist !== contactlist && prevIncome !== income){
            setNowContract('ALL')
            getNowContractIncomes("ALL")
        }else if(prevContactlist !== contactlist){
            setNowContract('ALL')
        }else if(prevIncome !== income){
            getNowContractIncomes(nowContract)
        }
    },[contactlist,income])

    const handlePageClick = (e, index) => {
        e.preventDefault();
        setPage({
            ...page,
            currentPage: index,
            currentPageIndex:  parseInt(index/pageIndexSize)
        })
        window.scrollTo(0, 0)
     };

    const handlePageFirstClick = (e) => {
         e.preventDefault();
         setPage({
            ...page,
            currentPage: 0,
            currentPageIndex: 0
        })
         window.scrollTo(0, 0)
     }

    const handlePageLastClick = (e) => {
        e.preventDefault();
        setPage({
            ...page,
            currentPage: pageCount,
            currentPageIndex : lastPageIndex
        })
        window.scrollTo(0, 0)
    }

    const getNowContractIncomes = (nowContract) =>{
        if(nowContract === 'ALL'){
            setIncomes(income)
            setPage({
                ...page,
                pageCount:  parseInt((income.length)/pageSize),
                lastPageIndex :  parseInt((income.length)/(pageSize*pageIndexSize)),
                currentPage: 0,
                currentPageIndex: 0,
            })
        }else {
            let newincome = _.filter(income, function(o) {
                let a = _.findIndex(o.incomes, function(v){
                    return v.symbol === nowContract
                })
                return a !== -1
            })
            setIncomes(newincome)
            setPage({
                ...page,
                pageCount:  parseInt((newincome.length)/pageSize),
                lastPageIndex :  parseInt((newincome.length)/(pageSize*pageIndexSize)),
                currentPage: 0,
                currentPageIndex: 0,
            })
        }
    }

    const changeNowContract = (value) => {
        setNowContract(value)
        getNowContractIncomes(value)
    }

    const dayorNot = (period) =>{
        if(period === 'day'){
            return t('balance.pnlhistory.contract')
        }else{
            return t('balance.date')
        }
    }
    
    const count = useMemo(() =>calcPaginationCount(currentPageIndex,lastPageIndex,pageCount),[currentPageIndex,lastPageIndex,pageCount])
    const all = useMemo(() =>calcAll(incomes,nowContract),[incomes,nowContract])
    return (
        <>
         <div style={{display:"flex", flex:"1 1 0%", marginBottom:"10px"}}>
            <div className="balanceperiod balanceeperiod">
                {period === 'all'? "~ " + endDate : startDate+ " ~ "+ endDate }
            </div>
            <div style={{display:"flex"}}>
                {period !== 'day'?
                    <>
                    <span className = "balanceperiod " style={{marginRight:"12px", lineHeight:"40px"}}>{t('balance.pnlhistory.contract')} </span>
                        <Dropdown arrowClassName='myArrowClassName'
                            options={contactlist}
                            value ={nowContract}
                            onChange={value => changeNowContract(value.value)}
                        />
                    </>
                    :<></>}
            </div>
        </div>
         <div className="balacetototal-con">
                <div style={{width:"33%"}}>
                    <div className="balance-header-total">{t('balance.pnlhistory.totalprofit')}</div>
                    <div  className="balanceBase" >
                        <Propfitdiv num={all[0]} classs="pnlprice"/>
                       {/* {this.profitdiv(all[0])} */}
                        <div className="pnlusdt"> USDT</div>
                    </div>
                </div>
                <div style={{width:"33%"}}>
                    <div className="balance-header-total">{t('balance.pnlhistory.totalloss')}</div>
                    <div  className="balanceBase" >
                    <Lossdiv num={all[1]} classs="pnlprice"/>
                       {/* {this.lossdiv(all[1])} */}
                        <div className="pnlusdt"> USDT</div>
                    </div>
                </div>
                <div style={{width:"33%", marginLeft:"10px"}}>
                    <div className="balance-header-total">{t('balance.pnlhistory.netpnl')}</div>
                    <div  className="balanceBase" >
                        <ProLossdiv num={all[2]} classs="pnlprice"/>
                        {/* {this.profitOrLoss(all[2])} */}
                        <div className="pnlusdt"> USDT</div>
                    </div>
                </div>
         </div>
         <div style={{overflowX:"auto"}}>
            <Table>
                <thead>
                    <tr>
                        <th style={{minWidth:"100px"}} className="bcol-table-th">{dayorNot(period)}</th>
                        <th style={{minWidth:"135px"}} className="bcol-table-th">{t('balance.pnlhistory.realizedpnl')} (USDT)</th>
                        {period !== 'day'?  <th style={{minWidth:"160px"}} className="bcol-table-th">{t('balance.pnlhistory.accumulatedpnl')} (USDT)</th> : <></>}
                    </tr>
                </thead>
                <tbody>
                    {generateDOM(incomes,nowContract,all,currentPage,period)}
                </tbody>
            </Table>
            {!isReady? 
            <div style={{width:"100%", minHeight:"200px", textAlign:"center", display:"flex"}}>
                <div style={{flex:"1 1 0%", placeSelf:"center"}}>
                <SyncLoader
                    size={10}
                    color="#58b589"
                    margin="2px" />
                </div>
            </div>
             :<></>}
              {pageCount>0? 
              <div>
              <Pagination aria-label="Page navigation ">
            {currentPageIndex<=0? <></>: 
            <PaginationItem disabled={currentPageIndex <= 0}>
                <PaginationLink onClick={e=>handlePageFirstClick(e)} first  href="#" />
            </PaginationItem>}
           {currentPage <=0? <></>: 
           <PaginationItem disabled={currentPage <= 0}>
                <PaginationLink onClick={e=>handlePageClick(e,currentPage-1)} previous href="#" />
            </PaginationItem>}
           
            {[...Array(count)].map((page, i) => 
             <PaginationItem active={(i+currentPageIndex*pageIndexSize) === currentPage} key={i}>
            <PaginationLink onClick={e => handlePageClick(e, (i+currentPageIndex*pageIndexSize))} href="#">
              {(i+currentPageIndex*pageIndexSize) + 1}
            </PaginationLink>
          </PaginationItem>
            )}

            {currentPage>=pageCount? <></>:   
            <PaginationItem disabled={currentPage >= pageCount}>
                <PaginationLink onClick={e=>handlePageClick(e,currentPage+1)} next href="#" />
            </PaginationItem>}
          
            {currentPageIndex >= lastPageIndex? <></>:
            <PaginationItem disabled={currentPageIndex >= lastPageIndex}>
                <PaginationLink onClick={e=>handlePageLastClick(e)} last  href="#" />
            </PaginationItem>
            }
            </Pagination>
              </div>
             :<></>}
            </div>

        </>
    )
}
export default PnlListTable;