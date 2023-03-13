import React from 'react';


const TextInput = (props) =>{
    const {type, classes, value, name, Inref, handleChange}= props;


return(
    <input
        type={type}
        className={classes}
        value={value}
        name={name}
        ref={Inref}
        onChange={handleChange}
    />
)
}
export default TextInput;
