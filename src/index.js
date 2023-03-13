/* eslint-disable no-console */
/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import rootReducer from './store/modules';
import rootSaga from './store/sagas';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './i18n';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);


ReactDOM.render(
  // <React.StrictMode>
  <CookiesProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </CookiesProvider>,
  // </React.StrictMode>
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
