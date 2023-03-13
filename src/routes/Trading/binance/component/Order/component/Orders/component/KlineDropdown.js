import React from 'react';
import { AiOutlineFall, AiOutlineRise } from "react-icons/ai";
import Dropdown from 'react-dropdown';

function KlineDropdown({direction, options,changeValue}) {
   return (
    <div className="klinedrop">
        <div>
            {direction ==='up'? <AiOutlineRise size={24}/>:<AiOutlineFall size={24}/>}
        </div>
        <Dropdown
            arrowClassName='kline-drop-arrow'
            controlClassName="kline-drop-control"
            className='kline-drop-root'
            menuClassName='last-drop-menu'
            options={options}
            value ={direction}
            onChange={changeValue}
        />
    </div>
   )
}

export default React.memo(KlineDropdown)