import React from 'react'
import LabelText from './component/LabelText'
import TextInput from './component/TextInput';
import ErrText from './component/ErrText';


//type에 따라서 validation 설정


 const InputBox = (props) => {
    const { autoComplete='off',validation,value,inputType, label, name, required, errors,onChange} = props;
    
    //const textRef = useRef(null);
    //const value = useSelector(state => state.auth.getIn([page,'form', type]))
    console.log(errors)
    return(
        <div className="log-box">
            <LabelText
                title = {label}
                required = {required}
            />
            <TextInput
                autoComplete={autoComplete}
                inputType={inputType}
                name={name}
                onChange={onChange}
                value={value}
                validation={validation}
                errors={errors}
            />
            <ErrText
                errors={errors}
            />
        </div>
    )

}


export default InputBox;
