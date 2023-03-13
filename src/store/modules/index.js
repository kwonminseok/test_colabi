import { combineReducers } from 'redux';
import websocket from './websocket';
import orderbook from './orderbook';
import user from './user';
import api from './api';
import home from './home';
import support from './support';
import auth from './auth';
import trade from './trade';
import order from './order';
import recents from './recents';
import chart from './chart';
import hong from './hong';

export default combineReducers({
  websocket,
  orderbook,
  user,
  api,
  home,
  support,
  auth,
  trade,
  order,
  recents,
  chart,
  hong
});
