import React from 'react';



const checkBtn = (props) =>{
    const {onClick, name} = props;

    return(
        <button onClick={onClick} className= 'regsjdfkD3'>
            {name}
        </button>
    )

}

export default checkBtn;