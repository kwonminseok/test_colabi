import React from 'react'


function getClasses (num){
    if(num>0){
        return ' balancetotal-de'
    }else{
        return ' balancetotal'
    }
}

function Propfitdiv ({num, classs=''}){

    const classes = classs + getClasses(num);

    return <div className={classes}> {num}</div>
}

export default React.memo(Propfitdiv);