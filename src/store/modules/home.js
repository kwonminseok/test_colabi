import { createAction, handleActions } from 'redux-actions';

export const SET_PAGE = 'home/SET_PAGE';


const initialState = {
    page:""
}



const reducer = {
    [SET_PAGE]: (state,action) => ({
        ...state,
        page: action.payload
    })
};


export const setPage = createAction(SET_PAGE);


export default handleActions(reducer, initialState);
