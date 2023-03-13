import React, {useMemo} from 'react'

function requiredItem (require){
    if(require){
       return  <span style={{color:"red"}}>*</span>
    }else{
        return<></> 
    }
}


const LabelText = (props) =>{
    const { title, required} = props;
    const req = useMemo(() => requiredItem(required), [required])
    return(
        <div className="logOrgn3">
            {title}
            {req}
        </div>
    )
}

export default LabelText;