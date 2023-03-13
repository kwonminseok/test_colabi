import React, {useState, useEffect, useMemo } from 'react';
import { Table,Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

const pageSize =15;
const pageIndexSize = 5;


function calcPaginationCount(currentPageIndex, lastPageIndex, pageCount){
    if(currentPageIndex === lastPageIndex){
        return pageCount%pageIndexSize +1
    }else {
        return 5;
    }
}

const Faq = (props) => {

    const [cP, setCP] = useState(0)
    const [cPI, setCPI] = useState(0)
    const [lPI, setLPI] = useState(0)
    const [pC, setPC] = useState(0)
    const { t, i18n } = useTranslation();


    useEffect(() =>{
        setPC(parseInt(props.faqlist.length/pageSize))
        setLPI(parseInt(props.faqlist.length/(pageSize*pageIndexSize)))
    },[props.faqlist])


    useEffect(() =>{
        props.goTop()
    },[cP])
    

    const handlePageClick = (e, index) => {
        e.preventDefault();
        setCP(index)
        setCPI(parseInt(index/pageIndexSize))
     };

    const handlePageFirstClick = (e) => {
         e.preventDefault();
         setCP(0)
         setCPI(0)
         
     }

    const handlePageLastClick = (e) => {
        e.preventDefault();
        setCP(pC)
        setCPI(lPI)

    }


    const count = useMemo( () => calcPaginationCount(cPI,lPI,pC),[cPI,lPI,pC] )

    const generateDOM = () => {
        const {faqlist} = props;
        let count =0;
        return _.map(faqlist.slice(cP*pageSize), item => {
            if(count<pageSize){
                count++;
                    return (
                        <tr key={item.id}>
                        <td className="contactlist-th contact-table-num" style={{textAlign:"center"}}>{item.id}</td>
                        <td className="contactlist-th noticetitle" style={{paddingLeft:"25px", textAlign:"left"}}>
                            <Link to={'/support/faq/'+item.id}>
                            {item.subject}
                            </Link>
                            <div className="contact-web-date">
                                {item.createdat}
                            </div>
                        </td>
                        <td className="contactlist-th contact-table-date" style={{textAlign:"center"}}>{item.createdat}</td>
                        </tr>
                    )
            }
        })
    }

        return(
            <div >
            <Table >
                <thead>
                    <tr className="contact-table-head">
                        <th style={{width:"55px"}} className="contactmain2-th ">{t('notices.no')}</th>
                        <th className="contactmain2-th ">{t('notices.subject')}</th>
                        <th style={{width:"120px"}} className="contactmain2-th">{t('notices.date')}</th>
                    </tr>
                </thead>
                <tbody style={{fontSize:"14px", color:"#444"}}>
                    {generateDOM()}
                </tbody>
            </Table>
            <div style={{padding:"40px 0", width:"100%"}}>
            <Pagination aria-label="Page navigation example">
                {cPI<=0? <></>: 
                <PaginationItem disabled={cPI <= 0}>
                    <PaginationLink onClick={e=>handlePageFirstClick(e)} first  href="#" />
                </PaginationItem>}
               {cP <=0? <></>: 
               <PaginationItem disabled={cP <= 0}>
                    <PaginationLink onClick={e=>handlePageClick(e,cP-1)} previous href="#" />
                </PaginationItem>}
               
                {[...Array(count)].map((page, i) => 
                 <PaginationItem active={(i+cPI*pageIndexSize) === cP} key={i}>
                <PaginationLink onClick={e => handlePageClick(e, (i+cPI*pageIndexSize))} href="#">
                  {(i+cPI*pageIndexSize) + 1}
                </PaginationLink>
              </PaginationItem>
                )}

                {cP>=pC? <></>:   
                <PaginationItem disabled={cP >= pC}>
                    <PaginationLink onClick={e=>handlePageClick(e,cP+1)} next href="#" />
                </PaginationItem>}
              
                {cPI >= lPI? <></>:
                <PaginationItem disabled={cPI >= lPI}>
                    <PaginationLink onClick={e=>handlePageLastClick(e)} last  href="#" />
                </PaginationItem>
                }
            </Pagination>
            </div>
            </div>
        )
    
}




export default Faq;
