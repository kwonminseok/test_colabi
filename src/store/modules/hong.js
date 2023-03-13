import { createAction, handleActions } from 'redux-actions';

export const GET_MARK = 'hong/GET_MARK';
export const SET_MARK = 'hong/SET_MARK';


const initialState = {
    data:[]
}

const reducer = {
    [SET_MARK]: (state, action) =>({
        ...state,
        data: action.payload
    })
}

export const getMark = createAction(GET_MARK);
export const setMark = createAction(SET_MARK);
export default handleActions(reducer,initialState);