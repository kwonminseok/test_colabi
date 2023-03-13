import React, { useMemo } from 'react';

function setClass(errors,touched){
    
    if(errors !== undefined && touched !== undefined){
        return 'logbox invalidborder'
    }else return 'logbox '
}

const TextInput = (props) =>{
    const { autoComplete, validate,inputType, value, touched,name, errors, placeholder = undefined, onChange, disabled= false}= props;
    
    const classes = useMemo(()=>
        setClass(errors,touched)
    ,[errors,touched])

    return(
        <div className={classes}>
            <input
                className="loginput-box"
                autoComplete={autoComplete}
                placeholder={placeholder}
                name={name}
                type={inputType}
                disabled={disabled}
                value={value}
                onChange={onChange}
                validate={validate}
            />
        </div>
    )


}

export default TextInput;
