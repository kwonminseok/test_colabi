import { createAction, handleActions } from 'redux-actions';

export const CHANGE_RECENTS_DEPTH = 'recents/CHANGE_RECENTS_DEPTH';
export const SET_INITIAL_RECENTS_DEPTH ='recents/SET_INTIIAL_RECENTS_DEPTH';


const initialState = {
    unit: 'real'
}

const reducer = {
    [CHANGE_RECENTS_DEPTH]: (state,action) => ({
        ...state,
        unit: action.payload
    }),
    [SET_INITIAL_RECENTS_DEPTH]: (state) => ({
        ...state,
        unit: 'real'
    })
}


export const changeRecentsDepth = createAction(CHANGE_RECENTS_DEPTH);
export const setInitialRecentsDepth = createAction(SET_INITIAL_RECENTS_DEPTH);

export default handleActions(reducer, initialState);