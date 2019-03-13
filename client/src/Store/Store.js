import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import authentication from '../Reducers/AuthenticationReducer';
import language from '../Reducers/LanguageReducer';
import registration from '../Reducers/RegistrationReducer';

const loggerMiddleware = createLogger();

const rootReducer = combineReducers({ language, authentication, registration });
const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
  ),
);

export default store;
