import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

const TextInput = (props) =>{

    const { autoComplete, id , disable,inputType, value,name,register, classes, onChange,placeholder, validate, labe =''} = props;
    const {contClass, fieldClass} = classes;
    //const textRef = getRef
    
    // const getRef = (ref) => {
    //     if(innerRef){
    //        return  props.innerRef(ref);
    //     }else{
    //         return 
    //     }
    // }

    // const focus = () =>{
    //     if(ref){
    //         ref.focus();
    //     }
    // }


    return(
        <div className={contClass}>
            <label>{label}</label>
            <input
                autoComplete={autoComplete}
                placeholder={placeholder}
                id={id}
                name={name}
                type={inputType}
                value={value}
                onChange={onChange}
                className={fieldClass}
                disable={disable}
                ref={register}
            />
            <div className='logauth'>
                {error}
            </div>
        </div>
    )
}

export default TextInput;