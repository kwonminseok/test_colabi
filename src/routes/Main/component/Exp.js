import React from 'react'
import {Card} from '../../../components';
import _ from 'lodash'
function Exp ({title,sub,content,img,mb}){

    const generateContent = (content) => {
        return _.map(content,(item,index) =>{
            return <div key={index}>{item}</div>
        } )
    }
    return(
        <div className="flex" style={{padding:"20xp 0px"}}>
            {mb!== 'sm'?
            <>
            <div className="flex-1 mainbody">
            <Card className="main-info-card">
                    <div className="main-info-title">{title}</div>
                    <div className="main-info-sub">{sub}</div>
                    <div className="main-info-content">{generateContent(content)}</div>
            </Card>
            </div>
            <div className="flex-1"><img className="main-info-img" alt={title} src={img}/></div>
            </>
            :
            <Card className="flex-1 mob-info-main">
                <div className="mob-info-box">
                    <img className="main-info-img" src={img} alt={title}></img>
                    <div className="main-info-title">{title}</div>
                    <div className="main-info-sub">{sub}</div>
                    <div className="main-info-content">{generateContent(content)}</div>
                </div>
            </Card>}
            </div>
    )
}

export default Exp;