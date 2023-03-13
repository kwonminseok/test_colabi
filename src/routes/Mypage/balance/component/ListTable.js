import React,{useState, useEffect, useMemo} from 'react';
import _ from 'lodash'
import { useTranslation } from 'react-i18next';
import {Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import SyncLoader from "react-spinners/SyncLoader";
import Lossdiv from './Lossdiv';
import Propfitdiv from './Propfitdiv'
const pageSize =15;
const pageIndexSize = 5;

function calcPaginationCount(currentPageIndex, lastPageIndex, pageCount) {
    if(currentPageIndex === lastPageIndex){
        return pageCount%pageIndexSize +1
    }else {
        return 5;
    }
}

function calcAll(transferlist){
    let deposit = 0;
    let withdraw = 0;
    _.forEach(transferlist, item => {
            deposit += item.deposit;
            withdraw += item.withdraw; 
    })
    return [parseFloat(deposit).toFixed(2), parseFloat(withdraw).toFixed(2)];
}

function generateDOM(transferlist,all, currentPage) {
    let a = all[0]-all[1];
    let before = a;
    let after = a;
    let count =0;
    return _.map(transferlist, (item,index) =>{
            before = after;
            after = before-(item.deposit-item.withdraw);
            if(index>=currentPage*pageSize){
                if(count<pageSize){
                    count++;
                    return (
                        <tr key={item.timestamp} className="bcol-table-tr">
                            <td>{item.date}</td>
                            <td>{item.deposit !==0? parseFloat(item.deposit).toFixed(2): '-'}</td>
                            <td>{item.withdraw !==0? parseFloat(item.withdraw).toFixed(2): '-'}</td>
                            <td>{parseFloat(item.deposit-item.withdraw).toFixed(2)}</td>
                            <td>{parseFloat(before).toFixed(2)}</td>
                        </tr>
                    )
                }
            }
    })
}

const ListTable = (props) =>{
    const [page, setPage] = useState({
        currentPage: 0,
        currentPageIndex: 0,
        lastPageIndex: 0,
        pageCount: 0,
    })
    const { t } = useTranslation();
    const {currentPage,currentPageIndex,lastPageIndex,pageCount} = page;
    const {period, startPeriod, startDate, endDate, transferlist, isReady} = props;

    useEffect(() =>{
        if(transferlist.length){
            setPage({
                ...page,
                pageCount:  parseInt((transferlist.length)/pageSize),
                lastPageIndex :  parseInt((transferlist.length)/(pageSize*pageIndexSize)),
                currentPage: 0,
                currentPageIndex: 0,
            })
        }
    },[])

    useEffect(() =>{
        setPage({
            ...page,
            pageCount:  parseInt((transferlist.length)/pageSize),
                lastPageIndex :  parseInt((transferlist.length)/(pageSize*pageIndexSize)),
                currentPage: 0,
                currentPageIndex: 0,
        })
    },[transferlist])


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
    const count = useMemo(() =>calcPaginationCount(currentPageIndex,lastPageIndex,pageCount),[currentPageIndex,lastPageIndex,pageCount])
    const all = useMemo(() =>calcAll(transferlist),[transferlist])
    return (
        <>
            <div className="balanceeperiod">{period === 'all'? "~ " + endDate : startDate+ " ~ "+ endDate } {t('balance.dwhistory.title')}</div>
            <div className="balacetototal-con">
                <div className="balance-tranfer-total">
                    <div className="balance-header-total">{t('balance.dwhistory.totaldeposit')}</div>
                    <div  className="balanceBase" >
                        <Propfitdiv num={all[0]} />
                        <div> USDT</div>
                    </div>
                </div>
                <div className="balance-tranfer-total">
                    <div className="balance-header-total">{t('balance.dwhistory.totalwithdraw')}</div>
                    <div  className="balanceBase" >
                        <Lossdiv num ={all[1]}/>
                        <div> USDT</div>
                    </div>
                </div>
            </div>
            <div style={{overflowX:"auto"}}>
                <Table>
                    <thead>
                        <tr>
                            <th style={{minWidth:"100px"}} className="bcol-table-th">{t('balance.date')}</th>
                            <th style={{minWidth:"110px"}} className="bcol-table-th">{t('balance.dwhistory.deposit')} (USDT)</th>
                            <th style={{minWidth:"110px"}} className="bcol-table-th">{t('balance.dwhistory.withdraw')} (USDT)</th>
                            <th style={{minWidth:"135px"}} className="bcol-table-th">{t('balance.dwhistory.net')} (USDT)</th>
                            <th style={{minWidth:"160px"}} className="bcol-table-th">{t('balance.dwhistory.anet')} (USDT)</th>
                      </tr>
                    </thead>
                    <tbody>
                        {generateDOM(transferlist,all,currentPage)}
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
              <Pagination aria-label="Page navigation">
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

export default ListTable;