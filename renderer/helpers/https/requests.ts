import Axios from 'axios';
import { CreateNewPermissionPayloadInterface, LoginPayloadInterface } from '../typings/interfaces';

async function LoginRequest(payload: LoginPayloadInterface){
    return await Axios.post('/api/auth/login', payload).then((response) => {
      return response;
    }).catch((err) => {
      throw new Error(err);
    })
}

async function GetPermissionsRequest(){
  return await Axios.get('/api/settings/getpermissions').then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function CreateNewPermissionRequest(payload: CreateNewPermissionPayloadInterface){
  return await Axios.post('/api/settings/permissions', {
    permissionType: payload.permissionType,
    allowedUsers: payload.allowedUsers
  }).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

export {
    LoginRequest,
    GetPermissionsRequest,
    CreateNewPermissionRequest
}