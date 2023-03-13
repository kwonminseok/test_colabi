import React from 'react'
import { AiFillStar } from "react-icons/ai";
import classnames from 'classnames';
import{ useSelector, useDispatch} from 'react-redux'
import { useTranslation } from 'react-i18next';

function Optional({active, handleChange}){
    const dispatch = useDispatch();
    const searchValue = useSelector(state =>state.user.useOptional.filter.symbol)
    const {t} = useTranslation();
    const ChangeSerachValue = (e) =>{
        const a = checkSymbol(e.target.value)
        if(a !=='itissoooooooerrorrrrrr'){
            dispatch({type:'user/CHANGE_FILTER_SYMBOL_NAME', payload:a})
        }
    }
    
    const checkSymbol =(value) =>{
        var eng = /^[a-zA-Z]*$/; 
        if(value ===''){
            return ''
        }else if(eng.test(value)){
            if(value.length>20){
                value.substring(0,20)
            }
            return value
        }else{
            return 'itissoooooooerrorrrrrr'
        }
    }

    return(
        <div className="flex" style={{margin:"8px 4px"}}>
            <div 
                className={'mob-optional '+  classnames({ active: active === true })}
                onClick={()=> handleChange(!active)}
            > <AiFillStar size={14}/>
        </div>
        <div className="list-search">
            <input
            type='text'
            placeholder={t('searchSymbol.search')}
            value = {searchValue}
            onChange={ChangeSerachValue}/>
        </div>
    </div>
    )
}

export default React.memo(Optional);