import React from 'react'
import Dropdown from 'react-dropdown';

function TrigerPriceDropdown({options,changeValue,value}){
    return(
      <Dropdown
        arrowClassName='last-drop-arrow'
        controlClassName="last-drop-control"
        className='last-drop-root'
        placeholderClassName='lang-drop-place'
        menuClassName='last-drop-menu'
        options={options}
        value ={value}
        onChange={changeValue}
      />
    )
}

export default React.memo(TrigerPriceDropdown)
