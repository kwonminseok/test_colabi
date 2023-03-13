import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

export const CHANGE_INPUTS = 'api/CHANGE_INPUTS';
export const INITIALIZE_FORM ='auth/INITIALIZE_FORM ';
export const CHANGE_ERRORS = 'auth/CHANGE_ERRORS';

const initialState = Map({
    login: Map({
        form: Map({
            email: '',
            password: '',
            error:{}
        })
    }),
    password: Map({
        form: Map({
            currentPassword:'',
            newPassword:'',
            confirmPassword:''
        })
    }),
    api: Map({
        form: Map({
            newApi: '',
            newSecret: ''
        })
    }),
    register: Map({
        form: Map({
            checkTerm: true,
            newEmail:'',
            newPassword:'',
            newNickName:'',
            checkNickName:'',
            api:'',
            secret:'',
            error:{}
        })
    }),
    xrp:Map({
        address:'rPZ8PTVzpwJE4MMiGhg41d6Q44uoU1EBU6'
    })
})

const reducer = {
    [CHANGE_INPUTS] : (state,action) => {
        const {form, name, value} = action.payload;
        return state.setIn([form, 'form', name], value);
    },
    [CHANGE_ERRORS] :(state,action) =>{
        const {form, name, value} = action.payload;
        console.log(form,name,value)
        return state.setIn([form, 'form', 'error'], value)
    },
    [INITIALIZE_FORM]: (state,action) => {
        const initialForm = initialState.get(action.payload);
        return state.set(action.payload, initialForm);
    }
}


export const changeInputs = createAction(CHANGE_INPUTS);
export const changeErrors = createAction(CHANGE_ERRORS);
export const initializeForm = createAction(INITIALIZE_FORM);
export default handleActions(reducer, initialState);