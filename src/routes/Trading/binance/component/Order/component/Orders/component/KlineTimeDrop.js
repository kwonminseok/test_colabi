import React from 'react';
import { AiOutlineLineChart } from "react-icons/ai";
import Dropdown from 'react-dropdown';

function KlineTimeDrop({kline, options,changeValue}) {
   return (
    <div className="klinedrop">
        <div>
        <AiOutlineLineChart size={24}/>
        </div>
        <Dropdown
            arrowClassName='kline-drop-arrow'
            controlClassName="kline-drop-control"
            className='kline-drop-root'
            //placeholderClassName='lang-drop-place'
            menuClassName='last-drop-menu'
            options={options}
            value ={kline}
            onChange={changeValue}
        />
    </div>
   )
}

export default React.memo(KlineTimeDrop)