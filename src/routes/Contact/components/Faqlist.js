import React from 'react';
import _ from 'lodash'
import parse from 'html-react-parser';

class Faqlist extends React.Component{


    componentDidMount(){
        if(this.props.content.subject !== undefined){
            document.title = `${this.props.content.subject} | Bitcolabi `;
        }
        
    }

    componentDidUpdate(prevProps){
        if(this.props.content !== prevProps.content && this.props.content.subject !== undefined){
            document.title = `${this.props.content.subject} | Bitcolabi `;
        } 
    }

    generateParagraph(item,index){
        let count =0;
        return(
            <div key={index}>
                {item.title !==""?
                <h1 className="tehea">{parse(this.g(item.title,item.link,count))}</h1>:<></>
                }
                {this.generateSentence(item.content,item.link,count )}
            </div>
        )
    }

    generateSentence(content, link, count) {
        return _.map(content, (item,index) => {
            return(
                <p className="paragcon" key={index}>
                    {item.title !==""?
                    <span className="sehea">{parse(this.g(item.title,link,count))}</span>:<></>}
                   {parse(this.g(item.article,link,count))}
                </p>
            )
        })
    }
    g = (content,link,count) =>{
        var a='';
        while(content !== ''){
           a +=  (this.generateLink(content,link,count)).toString()
            content = this.subspliting(content)
        }
        return a
    }

    generateLink = (content,link,count) =>{
        var a = content.indexOf('<>')
        if(a === -1){
            return `${content.substring()}`
        }else if(a === 0){
            var b = content.indexOf('<>',2);
            var con = content.substring(2,b);
            count++;
            return(
                `<a href=${link[count-1]} style={{color:"#58b589}} target="_blank">${con}</a>`
            )
        }else{
            return `${content.substring(0,a)}`
        }
    }
    
    subspliting= (content) =>{
        var a = content.indexOf('<>')
        if(a === -1){
            return ''
        }else if(a ===0){
            var b = content.indexOf('<>',1)
            if(content.length<b+2){
                return ''
            }else{
                return content.substring(b+2);
            }
        }else{
            return content.substring(a)
        }
    }


    generateDOM(content){
        if(content !== undefined){
            const a = JSON.parse(content)
            return _.map(a, (item,index) =>{
                return this.generateParagraph(item,index)
            })
        }
    }

render(){
    const {content} = this.props;
    
    return(
        <div className="contact-notice-head">
            <div className="noticecontent-title">{content.subject}</div>
            <div>
                {content.createdat}
            </div>
            <div className="noticecontent-content">
                <div>
                  {this.generateDOM(content.content)}
                </div>
            </div>

        </div>
    )
}

}

export default Faqlist;
