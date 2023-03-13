import React from 'react'


const LinkText =(props) =>{
    const {title, classes ='', color, href} = props;


    return(
        <div className={classes}>
            <a style={{color: color}} href={href}>
                {title}
            </a>       
        </div>
    )

}

export default LinkText;
