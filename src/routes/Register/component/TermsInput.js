import React from 'react';
import { CustomInput } from '../../../components';

function TermsInput({id,isCheck,handleChange, label, terms, name}){


    
    return(
        <div className="regfield-api text-left" style={{marginBottom:"24px"}}>
            <CustomInput
                type='checkbox'
                className='ter-contorle'
                id={id}
                name={name}
                checked={isCheck}
                onChange={handleChange}
                label={label}
            />

            <a className="terms-link" href='/support/terms' target="_blank">
                {terms}
            </a>
            
        </div>
    )


}

export default React.memo(TermsInput)