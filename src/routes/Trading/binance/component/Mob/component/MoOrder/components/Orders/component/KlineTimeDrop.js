import React from 'react';
import { AiOutlineLineChart } from "react-icons/ai";
import Dropdown from 'react-dropdown';

function KlineTimeDrop({kline, options,changeValue}) {
   
   return (
    <div className="mobdrop">
        <div>
        <AiOutlineLineChart size={20}/>
        </div>
        <Dropdown
            arrowClassName='mob-drop-arrow'
            controlClassName="mob-drop-control"
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