import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setalerts, setauthentication, setsettings } from '../actions/actions';

const combiner = combineReducers({
    authentication: setauthentication,
    alerts: setalerts,
    settings: setsettings
})

const store = configureStore({
    reducer: combiner
})

export default store;