import React from 'react'


function getClasses (num){
    if(Math.abs(num)>0){
        return ' balancetotla-wi'
    }else{
        return ' balancetotla'
    }
}

function Lossdiv ({num, classs=''}){

    const classes =classs + getClasses(num);

    return <div className={classes}> {num}</div>
}

export default React.memo(Lossdiv);