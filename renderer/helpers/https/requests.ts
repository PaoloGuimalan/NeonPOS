import Axios from 'axios';
import { LoginPayloadInterface } from '../typings/interfaces';

async function LoginRequest(payload: LoginPayloadInterface){
    return await Axios.post('/api/auth/login', payload).then((response) => {
      return response;
    }).catch((err) => {
      throw new Error(err);
    })
}

export {
    LoginRequest
}