import React from 'react';


const SubBtn = (props) =>{
    const {title, disabled, id} = props;
    
    return(
        <div className='regMGND2od'>
            <button type='submit' id={id} className='chpwbutton' disabled={disabled}>
                {title}
            </button>
        </div>
    )
}

export default SubBtn;
