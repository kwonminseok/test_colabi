import { takeEvery,select, all,put } from "redux-saga/effects";


function* getOption() {
    
    const getSymbol = (state) => state.websocket.symbol;
    const getUserId = (state) => state.user.userInfo.id;

    const symbol = yield select(getSymbol)
    const id = yield select(getUserId)

    const userdata = JSON.parse(localStorage.getItem(`${symbol}-${id}-option`))
   

    if(userdata !== null){
        yield put({type: 'option/SET_OPTION_DATA', option: userdata})
    }else{
        yield put({type: 'option/RESET_OPTION_DATA'})
    }
}


function* setOption(){

    const getoption = (state) => state.option;
    const getSymbol = (state) => state.websocket.symbol;
    const getUserId = (state) => state.user.userInfo.id;

    const symbol = yield select(getSymbol)
    const id = yield select(getUserId)
    const option  = yield select(getoption)

    localStorage.setItem(`${symbol}-${id}-option`,JSON.stringify(option))
}



export function* optionsaga() {
    yield all([
        takeEvery('option/GET_OPTION_DATA',getOption),
        takeEvery('option/ADJUST_OPTION_DATA',setOption),
        // takeEvery('option/')
    ])
}



const optionSagas = [optionsaga()];
export default optionSagas;
