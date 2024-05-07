import sign from 'jwt-encode'
import jwt_decode from 'jwt-decode'
import { Dispatch } from '@reduxjs/toolkit';
import { AuthenticationInterface, SettingsInterface } from '../typings/interfaces';

const API = 'https://neonaiserver.onrender.com';
const SECRET = 'neonaiserver12345678';

var sseNtfsSource: any = null

const SSENotificationsTRequest = (dispatch: Dispatch<any>, authentication: AuthenticationInterface, settings: SettingsInterface) => {
    sseNtfsSource = new EventSource(`${API}/access/ssehandshake/${settings.connectionToken}`);

    sseNtfsSource.addEventListener('devicefileslist', (e: any) => {
        const parsedresponse = JSON.parse(e.data)
        console.log(parsedresponse);
    })
}

const CloseSSENotifications = () => {
    if(sseNtfsSource){
        sseNtfsSource.close()
    }
}

export {
    SSENotificationsTRequest,
    CloseSSENotifications
}