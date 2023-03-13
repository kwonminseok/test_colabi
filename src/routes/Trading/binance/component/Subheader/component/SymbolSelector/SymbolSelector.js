import React, {useState, useEffect} from 'react'
import { GoTriangleDown } from "react-icons/go";
import {useSelector} from 'react-redux';
import {  Dropdown} from 'reactstrap';
import { ExtendedDropdown } from '../../../../../../../components'
import PopUp from './component/PopUp'
function SymbolSelector({symbol}){
    
    const [popupVisible, setPopupVisible] = useState(false)
    const {mbc, contract} = useSelector(state => ({
        mbc:state.user.mbc,
        contract: state.trade.symbol
    }))

    useEffect(() =>{
        setPopupVisible(false)
    },[contract,mbc.mb])

    const handlePopupVisible = () =>{
        setPopupVisible(prevState => !prevState)
    }
    
    return (
        <Dropdown isOpen={popupVisible} toggle={handlePopupVisible}>
            <div className="symbolinfo-drop" onClick={handlePopupVisible}>
                <div className="future-symbolinfo">
                    {symbol}
                </div>
                <GoTriangleDown size={15}/>
            </div>
            <ExtendedDropdown  style={{ outline: 'none', zIndex: '1200'}}>
                <PopUp
                    handlePopupVisible={handlePopupVisible}/>
            </ExtendedDropdown>
        </Dropdown>
    )


}

export default React.memo(SymbolSelector);