import Axios from 'axios';
import { AddProductRequestInterface, CreateNewPermissionPayloadInterface, LoginPayloadInterface, RegisterAccountInterface } from '../typings/interfaces';

const BACKDOOR = 'http://localhost:3000'

async function LoginRequest(payload: LoginPayloadInterface){
    return await Axios.post(`${BACKDOOR}/api/auth/login`, payload).then((response) => {
      return response;
    }).catch((err) => {
      throw new Error(err);
    })
}

async function GetPermissionsRequest(){
  return await Axios.get(`${BACKDOOR}/api/settings/getpermissions`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function CreateNewPermissionRequest(payload: CreateNewPermissionPayloadInterface){
  return await Axios.post(`${BACKDOOR}/api/settings/permissions`, {
    permissionType: payload.permissionType,
    allowedUsers: payload.allowedUsers
  }).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function GetUsersRequest(){
  return await Axios.get(`${BACKDOOR}/api/auth/getusers`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function RegisterAccountRequest(payload: RegisterAccountInterface) {
  return await Axios.post(`${BACKDOOR}/api/auth/register`, payload).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function AddProductRequest(payload: AddProductRequestInterface) {
  return await Axios.post(`${BACKDOOR}/api/menu/addproduct`, payload).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

async function GetProductsListRequest() {
  return await Axios.get(`${BACKDOOR}/api/menu/getproducts`).then((response) => {
    return response;
  }).catch((err) => {
    throw new Error(err);
  })
}

export {
    LoginRequest,
    RegisterAccountRequest,
    GetPermissionsRequest,
    CreateNewPermissionRequest,
    GetUsersRequest,
    AddProductRequest,
    GetProductsListRequest
}