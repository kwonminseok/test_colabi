import React from 'react'
import Optional from './Optional'
import {useSelector, useDispatch} from 'react-redux';
import SymbolTable from './SymbolTable';
import SymbolTitle from './SymbolTitle';
//import {useTranslation} from 'react-i18next';
const PopUp = () =>{
    //const { t } = useTranslation();
    const dispatch = useDispatch();
    const active = useSelector(state => state.user.useOptional.active)
    const hnandleChnage = (get) =>{
        dispatch({type:"user/SET_USER_OPTIONAL_ACTIVE", payload:get})
    }

    return(
            <div className="droplist">
                <div className="symbol-drop">
                    <Optional
                        active={active}
                        handleChange={hnandleChnage}
                    />
                    <SymbolTitle/>
                    <div className="symbol-droplist">
                        <SymbolTable
                        active={active}/>
                    </div>
                </div>
            </div>
    )
}

export default PopUp;