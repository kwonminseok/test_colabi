import React, {useState, useEffect} from 'react'
import { BiChevronsRight } from "react-icons/bi";
import { RiVolumeDownLine } from "react-icons/ri";

function Notice({noticeMain,t}) {
    const [date,setDate] = useState("")

    useEffect(()=>{
        if(noticeMain.createdat !== undefined){
            setDate((noticeMain.createdat).substring(5,10))
        }

    },[noticeMain])

   


    return(
        <div className="notice-container">
          <div className="main-notice" >
            <a href={'/support/notice/'+noticeMain.id} className="main-noticepage">  <RiVolumeDownLine size={20}/><div style={{padding:"0 10px"}}> <span style={{paddingRight:"10px"}}>{noticeMain.subject}</span> <span style={{paddingLeft:"10px", borderLeft:"1px solid"}}>{date}</span></div> </a>
            <a href="/support/notice" className="main-noticepage"><div style={{paddingLeft:"10px", paddingRight:"5px"}}>{t('main.more')}</div>  <BiChevronsRight size={20}/></a>
          </div>
        </div>
    )
}

export default React.memo(Notice)