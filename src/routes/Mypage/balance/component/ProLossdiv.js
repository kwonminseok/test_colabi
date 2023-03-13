import React from 'react'


function getClasses (num){
    if(num>0){
        return ' balancetotal-de'
    }else if(num<0){
        return ' balancetotla-wi'
    }else {
        return ' balancetotla'
    }
}

function ProLossdiv ({num,classs=''}){

    const classes = classs + getClasses(num);

    return <div className={classes}> {num}</div>
}

export default React.memo(ProLossdiv);