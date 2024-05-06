import { AlertsItem, AuthenticationInterface, SettingsInterface } from "../../typings/interfaces";
import { ActionProp } from "../../typings/props";
import { authenticationstate, settingsstate } from "../types/states";
import { SET_ALERTS, SET_AUTHENTICATION, SET_CLEAR_ALERTS, SET_FILTERED_ALERTS, SET_MUTATE_ALERTS, SET_SETTINGS } from "../types/types";

export const setauthentication = (state: AuthenticationInterface = authenticationstate, action: ActionProp) => {
    switch(action.type){
        case SET_AUTHENTICATION:
            return action.payload.authentication;
        default:
            return state;
    }
}

export const setalerts = (state: AlertsItem[] = [], action: any) => {
    switch(action.type){
        case SET_ALERTS:
            return [
                ...state,
                action.payload.alerts
            ];
        case SET_MUTATE_ALERTS:
            return [
                ...state,
                {
                    id: state.length,
                    ...action.payload.alerts
                }
            ]
        case SET_FILTERED_ALERTS:
            var filterstate = state.filter((flt: any) => flt.id != action.payload.alertID);
            return filterstate;
        case SET_CLEAR_ALERTS:
            return action.payload.alerts
        default:
            return state;
    }
}

export const setsettings = (state: SettingsInterface = settingsstate, action: any) => {
    switch(action.type){
        case SET_SETTINGS:
            return action.payload.settings;
        default:
            return state;
    }
}