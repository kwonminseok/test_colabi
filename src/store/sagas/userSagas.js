import { takeEvery, all, call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import _ from 'lodash'

const intiialLayouts =  [{h:26, i: 'chart', minH: 6, minW: 6, moved: false, static: false, w:6, x:0, y:0},
                         {h:26, i: 'orderbook', minH: 7, minW: 3, moved: false, static: false, w:7, x:6, y:0},
                         {h:26, i: 'recents', minH: 3, minW: 3, moved: false, static: false, w:3, x:13, y:0},
                        //  {h:14, i: 'alarms', minH: 3, minW: 3, moved: false, static: false, w:4, x:0, y:26},
                         {h:14, i: 'userinfo', minH: 3, minW: 3, moved: false, static: false, w:12, x:4, y:26}]

function* userAuthTotal(action) {
  const respons = yield call(checkAuth);
 
  if(respons ==='error'){
    yield put({
      type:"user/AUTH_LOGIN_FAILURE"
    })
  }else if(respons.data.success){
    yield put({
      type:"user/AUTH_LOGIN_SUCCESS"
    })
    if(action.payload === 'trading' || action.payload === 'account' || action.payload === 'balance' || action.payload === 'main'){
      const a = yield call(getUserInfo);
      if(a !=='error'){
        if(a.data.status === 'SUCCESS'){
         
          yield put({
            type: 'user/GET_USER_INFO',
            payload:{
              isMember: a.data.userInfo.isMember,
              userId: a.data.userInfo.userId,
              ia: a.data.userInfo.ia,
              ts: a.data.userInfo.ts,
              nickName: a.data.userInfo.nickName,
              tag: a.data.userInfo.tag,
              expired: a.data.userInfo.expired,
              isReady: true
            }
          })
          if(action.payload === 'trading'){
            const reserve = yield call(getRerveOrderList);
            if(reserve !== 'error'){
              if(reserve.data.message === 'Successfully sent'){
                yield put({
                  type: 'user/SET_USER_RESERVE_ORDER',
                  payload:{
                    reserve: reserve.data.Reservation
                  }
                })
              }
            }
            yield put({
              type:"api/CHECK_USER_CAN"
            })
          }else if(action.payload === 'balance'){
            yield put({
              type:"api/SET_USER_API_KEY"
            })
          }else if(action.payload === 'account'){
            const b = yield call(getUserMembershipHistory);
            if(b !== 'error'){
              if(b.data.status === "SUCCEES"){
                yield put ({
                  type: 'user/SET_USER_MEMBERSHIP_HISTORY',
                  payload:{
                    history: b.data.deposit
                  }
                })
              }
            }
            
          }
        }
      }else{
        yield put({
          type:"user/AUTH_LOGIN_FAILURE"
        })
      }
      
    }else if(action.payload === 'apichange'){
      const isapi = yield call(checkApi);
      if(isapi !=='error'){
        if(isapi.data.message ==="No API"){
          yield put({
            type:"user/SET_USER_IS_API",
            payload: false
          })
        }else if(isapi.data.message === "Yes API"){
          yield put({
            type:"user/SET_USER_IS_API",
            payload: true
          })
        }else{
          //document.location.href = '/';
        }
      }else{
        //document.location.href = '/';
      }
    }
  }else{
    yield put({
      type:"user/AUTH_LOGIN_FAILURE"
    })
  }
}

function* userAuthSimple(){
  const getUserstatus = state => state.user.status
  const userStatus = yield select(getUserstatus)
  const respons = yield call(checkAuth);
  if(respons ==='error'){
    yield put({
      type:"user/AUTH_LOGIN_FAILURE"
    })
  }else if(respons.data.success){

  }else{
    if(userStatus ==='SUCCESS'){
      yield put({
        type:"user/AUTH_LOGIN_FAILURE"
      })
    }
    
  }
}

function* userAuthnProfile () {
  const respon = yield call(checkAuth);
  if(respon ==='error'){
    yield put({
      type:"user/AUTH_LOGIN_FAILURE"
    })
  }else if(respon.data.success){
    yield put({
      type:"user/AUTH_LOGIN_SUCCESS"
    })
    const a = yield call(getUserInfo);
    if(a !== 'error'){
      if(a.data.status === 'SUCCESS'){
       
        yield put({
          type: 'user/GET_USER_INFO',
          payload:{
            isMember: a.data.userInfo.isMember,
            userId: a.data.userInfo.userId,
            ia: a.data.userInfo.ia,
            ts: a.data.userInfo.ts,
            nickName: a.data.userInfo.nickName,
            tag: a.data.userInfo.tag,
            expired: a.data.userInfo.expired
          }
        })
        yield put({
          type:"api/SET_USER_API_KEY"
        })
      }else{
        yield put({
          type:"user/AUTH_LOGIN_FAILURE"
        })
      }
    }else{
      yield put({
        type:"user/AUTH_LOGIN_FAILURE"
      })
    }

  }else{
    yield put({
      type:"user/AUTH_LOGIN_FAILURE"
    })
  }
}

function logOut (action) {
  
  axios
    .post('/api/v2/logout', { Id: action.payload })
    .then(response => {
      if(response.data.status ==='SUCCESS'){
        document.location.href = '/';
      }else if(response.data.status ==='FAILURE'){
        document.location.href = '/';
      }else{
        document.location.href = '/';
      }
    })
    .catch(err => {
    
      document.location.href = '/';
    });
}


function* setUserOptional(action){

  const getUserStatus = state => state.user.userstatus;
  const userStatus = yield select(getUserStatus);

  if(userStatus !== 'none' && userStatus !== 'guest'){
    const g = yield call(setUserOptionalInfo, action.payload);
    if(g !== 'error'){
      if(g.data.success){
        yield put({type:"user/SET_USER_OPTIONAL",payload: action.payload})
        //success
      }else{
        //failed
      }
    }
  }else{
    yield put({type:"user/SET_USER_OPTIONAL",payload: action.payload})
  }
}

function* getUserOptional(){
  const a = yield call(getUserOptionalInfo)
  if(a !== 'error'){
    if(a.data.status === 'SUCCESS'){
      yield put({type:"user/SET_USER_OPTIONAL",payload:a.data.message})
      //a.message 저장하자.
    }else{
  
    }
  }
}


async function setUserOptionalInfo(options){
  try{
    const a = await axios.post('/api/v2/bookmarks/store', {BookMarks: options})
    return a
  }catch(e){
    return 'error'
  }
}

async function getUserOptionalInfo(){
  try{
    const a = await axios.post('/api/v2/bookmarks')
    return a
  }catch(e){
    return 'error'
  }
}

async function checkAuth(){
  try{
    const a = await axios.post('/api/v2/auth')
    return a
  }catch(e){
    return 'error';
  }
}

async function checkApi(){
  try{
    const a = await axios.post('/api/v2/check')
    return a
  }catch(e){
    return 'error';
  }
}
async function getUserInfo() {
  try {
    const a = await axios.post('/api/v2/profile')
    return a
  }catch(e){
    
    return 'error';
  }
}

async function getRerveOrderList() {
  try{
    const a = await axios.post('/api/v2/reservations')
    return a
  }
  catch(e){
    return 'error';
  }
}

async function getUserMembershipHistory (){
  try{
    const a = await axios.post('/api/v2/traders/deposits')
    return a
  }catch(e){
    return 'error';
  }
}


function* getLayout() {
  yield put({
    type: 'user/SET_LAYOUT',
    payload: selectLayout()
  })
}

function selectLayout (){
  let a =intiialLayouts;
  try{
    a = JSON.parse(localStorage.getItem('futures-grid'));
  }catch(e){
    a = intiialLayouts;
   
  }
  
  let b =[];
  if(typeof a === 'object' && a !== null){
    _.forEach(intiialLayouts, item => {
      let num = a.findIndex(function(o){
        return o.i === item.i
      });
      if(num !== -1){
        b.push(a[num]);
        if(!checkAvail(a[num]))
          return  intiialLayouts;
      }
    })
    return b
  }else return intiialLayouts;
}

function checkAvail (local) {
  if(typeof local.w ==='number' && typeof local.y === 'number' && typeof local.h ==='number' && typeof local.x ==='number' && typeof local.minH ==='number' && typeof local.minW ==='number' && typeof local.moved ==='boolean' && typeof local.static ==='boolean'){
    return true;
  }else return false;
}


export function * usersa () {
  yield all([
    takeEvery('user/AUTH_LOGOUT', logOut),
    takeEvery('user/USER_AUTH_AND_PROFILE', userAuthnProfile),
    takeEvery('user/USER_AUTH_TOTAL', userAuthTotal),
    takeEvery('user/GET_LAYOUT', getLayout),
    takeEvery('user/USER_AUTH_SIMPLE',userAuthSimple),
    takeEvery('user/UPDATE_USER_OPTIONAL', setUserOptional),
    takeEvery('user/SET_LOGGED_USER_OPTIOANL', getUserOptional)
  ]);
}

const userSagas = [usersa()];
export default userSagas;
