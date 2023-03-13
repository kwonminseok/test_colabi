import React from 'react';
import { Table,Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

const pageSize =15;
const pageIndexSize = 5;


class Notice extends React.Component {



    state = {
        currentPage: 0,
        currentPageIndex: 0,
        lastPageIndex: 0,
        pageCount: 0,
    }




    componentDidUpdate(prevProps,prevState) {
        if(this.props.noticelist !== prevProps.noticelist){
            this.setState({
                pageCount:  parseInt((this.props.noticelist.length)/pageSize),
                lastPageIndex :  parseInt((this.props.noticelist.length)/(pageSize*pageIndexSize))
            })
        }
        if(this.state.currentPage !== prevState.currentPage){
            this.props.goTop()
        }
    }

    handlePageClick = (e, index) => {
        e.preventDefault();
        this.setState({
            currentPage: index,
            currentPageIndex:  parseInt(index/pageIndexSize)
          });
        
          
     };

     handlePageFirstClick = (e) => {
         e.preventDefault();
         this.setState({
             currentPage: 0,
             currentPageIndex: 0
         })
         
     }

    handlePageLastClick = (e) => {
        e.preventDefault();
        this.setState({
            currentPage: this.state.pageCount,
            currentPageIndex : this.state.lastPageIndex
        })
    }

    calcPaginationCount(currentPageIndex, lastPageIndex, pageCount) {
        if(currentPageIndex === lastPageIndex){
            return pageCount%pageIndexSize +1
        }else {
            return 5;
        }
    }


    generateDOM(currentPage){
        const {noticelist} = this.props;
        let count =0;
        return _.map(noticelist.slice(currentPage*pageSize), item => {
            if(count<pageSize){
                count++;
                    return (
                        <tr key={item.id}>
                        <td className="contactlist-th contact-table-num" style={{textAlign:"center"}}>{item.id}</td>
                        <td className="contactlist-th noticetitle" style={{paddingLeft:"25px", textAlign:"left"}}>
                            <Link to={'/support/notice/'+item.id}>
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

    render(){
        const {currentPage, currentPageIndex,lastPageIndex,pageCount } = this.state;
        const {t} = this.props;
        const count = this.calcPaginationCount(currentPageIndex,lastPageIndex,pageCount)
        
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
                    {this.generateDOM(currentPage)}
                </tbody>
            </Table>
            <div style={{padding:"40px 0", width:"100%"}}>
            <Pagination aria-label="Page navigation example">
                {currentPageIndex<=0? <></>: 
                <PaginationItem disabled={currentPageIndex <= 0}>
                    <PaginationLink onClick={e=>this.handlePageFirstClick(e)} first  href="#" />
                </PaginationItem>}
               {currentPage <=0? <></>: 
               <PaginationItem disabled={currentPage <= 0}>
                    <PaginationLink onClick={e=>this.handlePageClick(e,currentPage-1)} previous href="#" />
                </PaginationItem>}
               
                {[...Array(count)].map((page, i) => 
                 <PaginationItem active={(i+currentPageIndex*pageIndexSize) === currentPage} key={i}>
                <PaginationLink onClick={e => this.handlePageClick(e, (i+currentPageIndex*pageIndexSize))} href="#">
                  {(i+currentPageIndex*pageIndexSize) + 1}
                </PaginationLink>
              </PaginationItem>
                )}

                {currentPage>=pageCount? <></>:   
                <PaginationItem disabled={currentPage >= pageCount}>
                    <PaginationLink onClick={e=>this.handlePageClick(e,currentPage+1)} next href="#" />
                </PaginationItem>}
              
                {currentPageIndex >= lastPageIndex? <></>:
                <PaginationItem disabled={currentPageIndex >= lastPageIndex}>
                    <PaginationLink onClick={e=>this.handlePageLastClick(e)} last  href="#" />
                </PaginationItem>
                }
            </Pagination>
            </div>
            </div>
        )
    }
}




export default withTranslation()(Notice);
