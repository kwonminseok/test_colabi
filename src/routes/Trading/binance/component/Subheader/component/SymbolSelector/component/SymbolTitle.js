import React,{useMemo} from 'react'
import { useTranslation } from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux'
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
const SymbolTitle = () =>{
    const dispatch = useDispatch();
    const filters = useSelector(state => state.user.useOptional.filter)
    const {t} = useTranslation();

    const changeFilterPrice = () =>{
        
        if(filters.price === 'none'){
            //up
            dispatch({type:"user/CHANGE_FILTER_INFO", payload:{price: 'up', percent:"none"}})
        }else if(filters.price === 'up'){
            dispatch({type:"user/CHANGE_FILTER_INFO", payload:{price: 'down', percent:"none"}})
            //down
        }else {
            dispatch({type:"user/CHANGE_FILTER_INFO", payload:{price: 'none', percent:"none"}})
            //none
        }
    }

    const changeFilterPercent = () =>{
        
        if(filters.percent === 'none'){
            dispatch({type:"user/CHANGE_FILTER_INFO", payload:{price: 'none', percent:"up"}})
            //up
        }else if(filters.percent === 'up'){
            dispatch({type:"user/CHANGE_FILTER_INFO", payload:{price: 'none', percent:"down"}})
            //down
        }else {
            dispatch({type:"user/CHANGE_FILTER_INFO", payload:{price: 'none', percent:"none"}})
            //none
        }
    }

    const priceTitle = useMemo(() =>{
        if(filters.price==='up'){
            return (
                <div  className="last" onClick={changeFilterPrice}>
                    {t('searchSymbol.last')}
                    <RiArrowUpSFill size={15} style={{color:"#58b589"}}/>
                </div>
            )
        }else if(filters.price === 'down'){
            return (
                <div  className="last" onClick={changeFilterPrice}>
                   {t('searchSymbol.last')}
                    <RiArrowDownSFill size={15} style={{color:"#58b589"}}/>
                </div>
            )
        }else {
            return (
                <div  className="last" onClick={changeFilterPrice}>
                   {t('searchSymbol.last')}
                </div>
            )
        }
    },[filters.price])

    const percentTitle = useMemo(() =>{
        if(filters.percent==='up'){
            return(
                <div className="percent" onClick={changeFilterPercent}>
                    24h %
                    <RiArrowUpSFill size={15} style={{color:"#58b589"}}/>
                </div>
            )
            
        }else if(filters.percent === 'down'){
                return(
                    <div className="percent" onClick={changeFilterPercent}>
                        24h %
                        <RiArrowDownSFill size={15} style={{color:"#58b589"}}/>
                    </div>
                )
            
        }else {
            return(
                <div className="percent" onClick={changeFilterPercent}>
                    24h %
                    <RiArrowDownSFill size={15} style={{color:"white"}}/>
                </div>
            )
        }
    },[filters.percent])


    return(
        <div className="symbol-drop-header">
            <div className="content">
                <div className="symbol">계약</div>
               {priceTitle}
               {percentTitle}
            </div>
        </div>
    )
}

export default SymbolTitle;