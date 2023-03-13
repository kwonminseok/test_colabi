import React from 'react'
import { CustomInput } from '../../../../../../../../components';

function OnlyCheckBox({isCheck,handleChange,id,label}){
    return(
        <CustomInput
        type='checkbox'
        id={id}
        className='orderflex'
        checked={isCheck}
        onChange={handleChange}
        label={label}
      />
    )
}

export default React.memo(OnlyCheckBox)
