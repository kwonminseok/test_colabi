/* eslint-disable import/no-named-default */
import { all } from 'redux-saga/effects';
import { default as websocketSagas } from './websocketSagas';
import { default as userSagas } from './userSagas';
import { default as apiSagas } from './apiSagas';
import {default as orderbookOrderSagas} from './orderbookOrderSagas';
import {default as supportSagas} from './supportSagas'
export default function * rootSaga () {
  yield all([
    ...apiSagas,
    ...userSagas,
    ...websocketSagas,
    ...orderbookOrderSagas,
    ...supportSagas
  ]);
}
