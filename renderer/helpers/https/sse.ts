import sign from 'jwt-encode'
import { jwtDecode } from 'jwt-decode'
import { Dispatch } from '@reduxjs/toolkit';
import { AuthenticationInterface, SettingsInterface } from '../typings/interfaces';

const API = 'https://neonaiserver.onrender.com';
const SECRET = 'neonaiserver12345678';

var sseNtfsSource: any = null

const SSENotificationsTRequest = (dispatch: Dispatch<any>, authentication: AuthenticationInterface, settings: SettingsInterface) => {
    sseNtfsSource = new EventSource(`${API}/access/ssehandshake/${settings.connectionToken}`);

    sseNtfsSource.addEventListener('devicefileslist', (e: any) => {
        const parsedresponse = JSON.parse(e.data)
        
        if(parsedresponse.status){
            const decodedresult: any = jwtDecode(parsedresponse.result);
            if(decodedresult.data.deviceID === settings.deviceID){
                try{
                    window.ipc.send('get-directories', decodeURIComponent(decodedresult.data.path));
                }
                catch(err){
                    console.log(err);
                }
            }
        }
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