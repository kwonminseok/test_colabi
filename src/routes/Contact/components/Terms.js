import React from 'react';
import _ from 'lodash';
import term from './a.json';

class Terms extends React.Component{


    componentDidMount(){
        document.title = `${this.props.t('accountregister.bitterms')} | Bitcolabi`;
    }

    generateParagraph(item,index){
        return(
            <div key={index}>
                {item.title !==""?
                <h1 className="tehea">{item.title}</h1>:<></>
                }
                {this.generateSentence(item.content)}
            </div>
        )
    }

    generateSentence(content) {
        return _.map(content, (item,index) => {
            return(
                <p className="paragcon" key={index}>
                {item.title !==""?
                <span className="sehea">{item.title}</span>:<></>}
                {item.article}
                </p>
            )
        })
    }

    generateDOM(){
        const {t} = this.props;
        if(t('type') ==='ko'){
            return _.map(term.kr, (item,index) => {
                return this.generateParagraph(item,index)
            })
        }else{
            return _.map(term.en, (item,index) => {
                return this.generateParagraph(item,index)
            })
        }
        
    }



    render(){
       
        return(
            <div style={{marginTop:"40px",padding:"0px 15px", color:"#222"}}>
                {this.generateDOM()}
           </div>
        )
    }
}

export default Terms;