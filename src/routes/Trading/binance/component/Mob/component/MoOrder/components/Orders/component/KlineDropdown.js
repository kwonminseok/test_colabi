import React from 'react';
import { AiOutlineFall, AiOutlineRise } from "react-icons/ai";
import Dropdown from 'react-dropdown';

function KlineDropdown({direction, options,changeValue}) {
    
   return (
    <div className="mobdrop">
        <div>
            {direction ==='up'? <AiOutlineRise size={20}/>:<AiOutlineFall size={20}/>}
        </div>
        <Dropdown
            arrowClassName='mob-drop-arrow'
            controlClassName="mob-drop-control"
            className='kline-drop-root'
            //placeholderClassName='lang-drop-place'
            menuClassName='last-drop-menu'
            options={options}
            value ={direction}
            onChange={changeValue}
        />
    </div>
   )
}

export default React.memo(KlineDropdown)