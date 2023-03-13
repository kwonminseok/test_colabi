import React, {useState, useEffect} from 'react'

const InputBox = (props)=>{
    const {inputType, label, name, type, register, required, err,page} = props;
    const [status, setStatus] = useState('')
    //const value = useSelector(state => state.auth.getIn([page,'form', type]))
    const [error, setError] = useState(false)

    useEffect(()=>{
        if(err !== undefined){
            setStatus('error')
            setError(true)
        }
    },[err])

    return(
        <div className="log-box">
            <LabelText
                title = {label}
                required = {required}
            />
            <TextInput
                inputType={inputType}
                name={name}
                page={page}
                type={type}
                register={register}
                status ={status}
            />
            {error ?
                <ErrText
                    err={err}
                />
                :<></>
            }
        </div>
    )
}
export default InputBox;