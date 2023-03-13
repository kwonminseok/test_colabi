import { createAction, handleActions } from 'redux-actions';


export const GET_NOTICE_LIST = 'support/GET_NOTICE_LIST';
export const SET_NOTICE_LIST = 'support/SET_NOTICE_LIST';
export const GET_NOTICE_CONTENT = 'support/GET_NOTICE_CONTENT';
export const SET_NOTICE_CONTENT ='support/SET_NOTICE_CONTENT';
export const GET_NOTICE_MAIN = 'support/GET_NOTICE_MAIN';
export const SET_NOTICE_MAIN = 'support/SET_NOTICE_MAIN';
export const GET_FAQ_LIST = 'support/GET_FAQ_LIST';
export const SET_FAQ_LIST = 'support/SET_FAQ_LIST';
export const GET_FAQ_CONTENT = 'support/GET_FAQ_CONTENT';
export const SET_FAQ_CONTENT ='support/SET_FAQ_CONTENT';

const initialState = {
    noticelist:[],
    faqlist:[],
    nowfaqpage:{},
    nownoticemain:{},
    nownoticepage:{}

}


const reducer = {
[SET_NOTICE_LIST]: (state, action) => ({
    ...state,
    noticelist: action.payload.noticelist
}),
[SET_NOTICE_CONTENT]: (state,action) => ({
    ...state,
    nownoticepage: action.payload.nownotice
}),
[SET_FAQ_LIST]: (state, action) => ({
    ...state,
    faqlist: action.payload.faqlist
}),
[SET_FAQ_CONTENT]: (state,action) => ({
    ...state,
    nowfaqpage: action.payload.nowfaq
}),
[SET_NOTICE_MAIN]: (state,action) => ({
    ...state,
    nownoticemain: action.payload.nownotice
}),

}


// export const GET_FAQ_LIST = 'support/GET_FAQ_LIST';
// export const SET_FAQ_LIST = 'support/SET_FAQ_LIST';
// export const GET_FAQ_CONTENT = 'support/GET_FAQ_CONTENT';
// export const SET_FAQ_CONTENT ='support/SET_FAQ_CONTENT';

export const getNoticeList = createAction(GET_NOTICE_LIST);
export const setNoticeList = createAction(SET_NOTICE_LIST);
export const getNoticeContent = createAction(GET_NOTICE_CONTENT);
export const setNoticeContent = createAction(SET_NOTICE_CONTENT)
export const getNoticeMain = createAction(GET_NOTICE_MAIN);
export const setNoticeMain = createAction(SET_NOTICE_MAIN);
export const getFaqList = createAction(GET_FAQ_LIST);
export const setFaqList = createAction(SET_FAQ_LIST);
export const getFaqContent = createAction(GET_FAQ_CONTENT);
export const setFaqContent = createAction(SET_FAQ_CONTENT);
export default handleActions(reducer, initialState);
