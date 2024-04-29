import { AuthenticationInterface } from "../../typings/interfaces";
import { ActionProp } from "../../typings/props";
import { authenticationstate } from "../types/states";
import { SET_AUTHENTICATION } from "../types/types";

export const setauthentication = (state: AuthenticationInterface = authenticationstate, action: ActionProp) => {
    switch(action.type){
        case SET_AUTHENTICATION:
            return action.payload.authentication;
        default:
            return state;
    }
}