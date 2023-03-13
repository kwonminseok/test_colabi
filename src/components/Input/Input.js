import React from 'react';


class Input extends React.Component{

constructor(props){
    super(props);

    this.state= {
        focussed: (props.locked && props.focussed) || false,
        value: props.value || '',
        error: props.error || '',
        label: props.label || ''
    };
}



render(){
    const {focussed, value, error, label} = this.state;
    const {id, type, locked} = this.props;

    return(
        <div className="inputfield">
            <input
                id={id}
                type="number"
                value={value}
                placeholder={label}
            />
        </div>
    )
}

}