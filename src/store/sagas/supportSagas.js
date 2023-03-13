import axios from 'axios';
import { takeEvery, all, call, put } from 'redux-saga/effects';
import Cookies from 'js-cookie';

function * getNoticeList () {
  let a = Cookies.get('Lang') || 'en';
  const respon = yield call(axiosNoticelist, a); 
 
  if(respon !== 'error'){
    if (respon.data.status === 'SUCCESS' && respon.data.message !== "Wrong Location") {
   
      yield put({
        type: 'support/SET_NOTICE_LIST',
        payload: {
          noticelist: respon.data.message,
        },
      });
    }else if (respon.data.message ==="Wrong Location"){
      document.location.href = '/';
    }
  }
}


function * getFaqList () {
  let a = Cookies.get('Lang') || 'en';
  const respon = yield call(axiosFaqlist, a); 
 
  if(respon !== 'error'){
    if (respon.data.status === 'SUCCESS' && respon.data.message !== "Wrong Location") {
    
      yield put({
        type: 'support/SET_FAQ_LIST',
        payload: {
          faqlist: respon.data.message,
        },
      });
    }else if (respon.data.message ==="Wrong Location"){
      document.location.href = '/';
    }
  }
}

function * getNoticeContent (id) {
  let a = Cookies.get('Lang') || 'en';
  const respon = yield call(axiosNoticeContent, id.payload,a);
  if( respon !== 'error'){
    if (respon.data.status === 'SUCCESS') {
      if(respon.data.message === "Invalid Notice ID"){
        document.location.href = '/support';
      }else if(respon.data.message === "Wrong Location"){
        document.location.href = '/';
      }else{
         yield put({
          type: 'support/SET_NOTICE_CONTENT',
          payload: {
            nownotice: respon.data.message,
          },
        });
      }
    }else{
      // document.location.href = '/';
    }
  }

}

function * getFaqContent (id) {
  let a = Cookies.get('Lang') || 'en';
  const respon = yield call(axiosFaqContent, id.payload,a);
  if( respon !== 'error'){
    if (respon.data.status === 'SUCCESS') {
      if(respon.data.message === "Invalid FAQ ID"){
        document.location.href = '/support';
      }else if(respon.data.message === "Wrong Location"){
        document.location.href = '/';
      }else{
         yield put({
          type: 'support/SET_FAQ_CONTENT',
          payload: {
            nowfaq: respon.data.message,
          },
        });
      }
      // yield put({
      //   type: 'support/SET_NOTICE_CONTENT',
      //   payload: {
      //     nownotice: respon.data.message,
      //   },
      // });
    }else{
      // document.location.href = '/';
    }
  }

}

function* getNoticeMain() {
  let a = Cookies.get('Lang') || 'en';
  const respon = yield call(axiosNoticeMain,a);
  if(respon !== 'error'){
    if (respon.data.status === 'SUCCESS') {
      if(respon.data.message !==null && respon.data.message !=="Wrong Location"){
        yield put({
          type: 'support/SET_NOTICE_MAIN',
          payload: {
            nownotice: respon.data.message,
          },
        });
      }else if (respon.data.message ==="Wrong Location"){
        document.location.href = '/';
      }
      
    }
  }
}

async function axiosNoticelist (lang) {
  try {
    const a = await axios.post(`/api/v2/notices/${lang}`);
    return a;
  } catch (e) {
    return 'error';
  }
}

async function axiosFaqlist (lang) {
  try {
    const a = await axios.post(`/api/v2/faqs/${lang}`);
    return a;
  } catch (e) {
    return 'error';
  }
}

async function axiosNoticeContent (id, lang) {
  try {
    const a = await axios.post(`/api/v2/notices/${lang}/${id}`);
    return a;
  } catch (e) {
    
    return 'error';
  }
}

async function axiosFaqContent (id, lang) {
  try {
    const a = await axios.post(`/api/v2/faqs/${lang}/${id}`);
    return a;
  } catch (e) {
    return 'error';
  }
}

async function axiosNoticeMain (lang){
  try{
    const a = await axios.post(`/api/v2/notice/${lang}`)
    return a;
  }catch (e){

    return 'error';
  }
}

export function * supportsaga () {
  yield all([
    takeEvery('support/GET_NOTICE_LIST', getNoticeList),
    takeEvery('support/GET_NOTICE_CONTENT', getNoticeContent),
    takeEvery('support/GET_NOTICE_MAIN', getNoticeMain),
    takeEvery('support/GET_FAQ_LIST',getFaqList),
    takeEvery('support/GET_FAQ_CONTENT', getFaqContent)
  ]);
}

const supportSagas = [supportsaga()];
export default supportSagas;
