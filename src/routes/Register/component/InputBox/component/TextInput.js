import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux'

function setClass(status){
    console.log(status)
    if(status === 'error'){
        return 'logbox invalidborder'
    }else return 'logbox '
  
}

const TextInput = (props) =>{
    const { status,page, type, inputType, value, name, register, placeholder = undefined,disable = false}= props;
    const dispatch = useDispatch();
    const value = useSelector(state => state.auth.getIn([page,'form', type]))
    const classes = useMemo(()=>
        setClass(status)
    ,[status])

    const handleChange = (e) =>{
        const {name, value} = e.target;
        console.log(name,value)
        switch(name){
            case 'email':{
                dispatch({
                    type:"api/CHANGE_INPUTS",
                    payload:{
                        name,
                        value,
                        form: 'login'
                    }
                })
                break;
            }
            case 'password':{
                dispatch({
                    type:"api/CHANGE_INPUTS",
                    payload:{
                        name,
                        value,
                        form: 'login'
                    }
                })
                break;
            }
        }
    }



    return(
        <div className={classes}>
            <input
                className="loginput-box"
                placeholder={placeholder}
                // id={id}
                name={name}
                type={inputType}
                value={value}
                onChange={handleChange}
                disabled={disable}
                ref={register}
            />
        </div>
    )


}

export default TextInput;
