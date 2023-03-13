import { createAction, handleActions } from 'redux-actions';

export const CHANGE_KLINE_INTERVAL = 'chart/CHANGE_KLINE_INTERVAL';
export const SUBSCRIBE_BARS = 'chart/SUBSCRIBE_BARS';
export const SET_CHART_READY = 'chart/SET_CHART_READY';
export const HISTORY_GET_BARS = 'chart/HISTORY_GET_BARS';
export const HISTORY_SET_LAST_BAR = 'chart/HISTORY_SET_LAST_BAR';
const initialState = {
    interval: '5',
    chartReady: false,
    history:{}
}

const reducer = {
    [CHANGE_KLINE_INTERVAL]: (state,action) => ({
        ...state,
        interval: action.payload
    }),
    [SET_CHART_READY]: (state,action) => ({
        ...state,
        chartReady: action.payload
    }),
    [HISTORY_SET_LAST_BAR]: (state,action) => ({
        ...state,
        history: {
            ...state.history,
            [action.payload.name]: {lastBar: action.payload.lastBar}
        }
    })
   
}

export const changeKlineInterval = createAction(CHANGE_KLINE_INTERVAL)
export const subscribeBars = createAction(SUBSCRIBE_BARS);
export const setChartReady = createAction(SET_CHART_READY)
export const historyGetBars = createAction(HISTORY_GET_BARS);
export const historySetLastBar = createAction(HISTORY_SET_LAST_BAR)
export default handleActions(reducer, initialState);