import React from 'react';
import {Input} from 'reactstrap';
import TextInput from './TextInput';
function ClassInput({title,type,value,classes,name,Inref,handleChange,isCheck,valueValid}){

    return(
        <div>
          <div className="regiOrgn3">
            {title} <span style={{color:"red"}}>*</span>
          </div>
          <div className="regfield-api">
            <TextInput
              type={type}
              className={classes}
              value={value}
              name={name}
              Inref={Inref}
              onChange={handleChange}
              // onBlur={() => isCheck()}
            />
            <div className='valNicksm2 '>
              {valueValid}
            </div>
          </div>
        </div>
    )

}

export default React.memo(ClassInput);