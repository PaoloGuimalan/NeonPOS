import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setauthentication } from '../actions/actions';

const combiner = combineReducers({
    authentication: setauthentication
})

const store = configureStore({
    reducer: combiner
})

export default store;