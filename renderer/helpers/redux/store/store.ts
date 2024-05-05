import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setalerts, setauthentication } from '../actions/actions';

const combiner = combineReducers({
    authentication: setauthentication,
    alerts: setalerts
})

const store = configureStore({
    reducer: combiner
})

export default store;