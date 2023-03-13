import React from 'react'


const ErrText = (props) =>{
    const {errors, touched} = props
    return(
        <div className='valNicksm2 '>
            {errors && touched? errors:null}
        </div>
    )


}

export default ErrText;
