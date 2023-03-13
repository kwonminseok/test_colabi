import React, {Component, createContext} from 'react';

export const FormCtx = createContext({
    fields: {},
    errors: {}
})

const validations = {
    required: {
        rule: () => /\S/,
        formatter(fieldName) {
          return `${fieldName} is required.`;
        }
    },
    email: {
        rule: () => /\S+@\S+\.\S+/,
        formatter(fieldName) {
          return `${fieldName} should contain only numbers.`;
        }
      }
}


export default class Form extends Component{
    state ={
        fields:{},
        errors:{}
    }

    setFields = (event, {id})=>{
        event.persist();
        console.log(event, {id})
        const{fields} = this.state;
        const field = fields[id];

        this.addField({
            field: {
                ...field,
                value: event.currentTarget.value
            }
        })
    }

    addField = ({field}) =>{
        const {id} = field;

        field = {
            value: '',
            ...field
        }
        if(id){
            this.setState(prevState =>{
            return{
                ...prevState,
                fields:{
                    ...prevState.fields,
                    [id]:field
                }
            }
            })
            return;
        }
        throw new Error(`please add 'id' field to the input: ${field}`)
    }

    validateField = id => {
        let error = '';

        const {
            value: fieldValue,
            validate,
            dispalyName,
            customRuls = {}
        } = this.state.fields[id];

        const rules = validate ? validate.split
    }

    render(){
        const {fields, errors} = this.state;
        const formCtx = {
            fields, 
            errors,
            addField:data =>{
                this.addField(data)
            },
            setFields: this.setFields,
            validateField: this.validateField
        }

        return(
            <form acion=''>
                <FormCtx.Provider value={formCtx}>
                    {this.props.children}
                </FormCtx.Provider>
            </form>
        )
    }
}