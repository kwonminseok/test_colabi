import { createAction, handleActions } from 'redux-actions';

export const ADD_PRICE_ALARM = 'option/ADD_PRICE_ALARM';
export const ADD_VOLUME_ALARM = 'option/ADD_VOLUME_ALARM';
export const ADD_SUDDEN_MOVE_ALARM = 'option/ADD_SUDDEN_MOVE_ALARM';
export const CANCEL_PRICE_ALARM = 'option/CANCEL_PRICE_ALRAM';
export const CANCEL_VOLUME_ALARM = 'option/CANCEL_VOLUME_ALARM';
export const CANCEL_SUDDEN_MOVE_ALARM = 'option/CANCEL_SUDDEN_MOVE_ALARM';
export const GET_OPTION_DATA = 'option/GET_OPTION_DATA';
export const SET_OPTION_DATA = 'option/SET_OPTION_DATA';
export const ADJUST_OPTION_DATA = 'option/ADJUST_OPTION_DATA';
export const RESET_OPTION_DATA = 'option/RESET_OPTION_DATA';

const initialState = {
  priceReach: [],
  unitvolume: [],
  suddenmove: [],
};

const reducer = {
  [ADD_PRICE_ALARM]: (state, action) => ({
    ...state,
    priceReach: [...state.priceReach, action.payload.new],
  }),
  [ADD_VOLUME_ALARM]: (state, action) => ({
    ...state,
    unitvolume: [action.payload.new],
  }),
  [ADD_SUDDEN_MOVE_ALARM]: (state, action) => ({
    ...state,
    suddenmove: [action.payload.new],
  }),
  [CANCEL_PRICE_ALARM]: (state, action) => ({
    ...state,
    priceReach: action.payload,
  }),
  [CANCEL_VOLUME_ALARM]: state => ({
    ...state,
    unitvolume: [],
  }),
  [CANCEL_SUDDEN_MOVE_ALARM]: state => ({
    ...state,
    suddenmove: [],
  }),
  [SET_OPTION_DATA]: (state, action) => action.option,
  [RESET_OPTION_DATA]: (state) => initialState
};

export const addPriceAlarm = createAction(ADD_PRICE_ALARM);
export const addVolumeAlarm = createAction(ADD_VOLUME_ALARM);
export const addSuddenMoveAlarm = createAction(ADD_SUDDEN_MOVE_ALARM);
export const cancelPriceAlarm = createAction(CANCEL_PRICE_ALARM);
export const cancelVolumeAlarm = createAction(CANCEL_VOLUME_ALARM);
export const cancelSuddenMoveAlarm = createAction(CANCEL_SUDDEN_MOVE_ALARM);
export const getOptionData = createAction(GET_OPTION_DATA);
export const setOptionData = createAction(SET_OPTION_DATA);
export const adjustOptionData = createAction(ADJUST_OPTION_DATA);
export const resetOptionData = createAction(RESET_OPTION_DATA);

export default handleActions(reducer, initialState);
