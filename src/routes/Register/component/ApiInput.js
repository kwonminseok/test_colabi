import React from 'react';
import {Input} from 'reactstrap'
function ApiInput ({ title,value,name,handleChange,isdisabled }) {
  return (
    <div className=''>
      <div className='regiOrgn3'>{title}</div>
      <div className='regfield-api'>
        <Input
          type='text'
          value={value}
          name={name}
          onChange={handleChange}
          disabled={isdisabled === 'valid' || isdisabled === 'cantTrade'}
        />
      </div>
    </div>
  );
}

export default React.memo(ApiInput);
