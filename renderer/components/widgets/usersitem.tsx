import React, { useState } from 'react'
import { AuthenticationInterface, SettingsInterface } from '../../helpers/typings/interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { UsersitemProp } from '../../helpers/typings/props';
import Buttonloader from '../loaders/buttonloader';
import { RemoveUserRequest } from '../../helpers/https/requests';
import { dispatchnewalert } from '../../helpers/reusables/alertdispatching';
import sign from 'jwt-encode';
import { JWT_SECRET } from '../../helpers/typings/keys';

function Usersitem({ mp, GetUsersProcess }: UsersitemProp) {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const settings: SettingsInterface = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();

  const [isRemovingUser, setisRemovingUser] = useState<boolean>(false);

  const RemoveUserProcess = () => {
    setisRemovingUser(true);
    const encodedDeletingID = sign({userID: settings.userID, accountID: mp.accountID}, JWT_SECRET);
    RemoveUserRequest(encodedDeletingID).then((response) => {
        if(response.data.status){
            GetUsersProcess();
            dispatchnewalert(dispatch, "success", response.data.message);
        }
        else{
            dispatchnewalert(dispatch, "success", response.data.message);
        }
        setisRemovingUser(false);
    }).catch((err) => {
        console.log(err);
        dispatchnewalert(dispatch, "error", "Error making user deletion request");
        setisRemovingUser(false);
    })
  }

  return (
    <div className='bg-white shadow-md flex flex-col p-[20px] h-fit w-full max-w-[350px]'>
        <div className='w-full'>
            <span className='font-semibold text-[17px]'>{mp.accountName.lastname}, {mp.accountName.firstname}, {mp.accountName.middlename}</span>
        </div>
        <div className='w-full'>
            <span className='text-[14px]'>{mp.accountID}</span>
        </div>
        <div className='w-full pt-[15px] flex flex-row'>
            <div className='flex flex-1'>
            <div className='text-[14px] w-fit bg-accent-tertiary text-white flex p-[5px] pl-[8px] pr-[8px]'>
                <span>{mp.accountType}</span>
            </div>
            </div>
            <div className='flex flex-row justify-end gap-[4px]'>
            {(authentication.user.accountID !== mp.accountID) && (
                authentication.user.permissions.includes("disable_user") && (
                <button className='text-[14px] w-fit bg-orange-500 text-white flex p-[5px] pl-[8px] pr-[8px] rounded-[4px]'>
                    <span>Disable</span>
                </button>
                )
            )}
            {(authentication.user.accountID !== mp.accountID) && (
                authentication.user.permissions.includes("delete_user") && (
                <button disabled={isRemovingUser} onClick={RemoveUserProcess} className='text-[14px] w-[70px] flex items-center justify-center bg-red-500 text-white flex p-[5px] pl-[8px] pr-[8px] rounded-[4px]'>
                    {isRemovingUser ? (
                        <Buttonloader size='14px' />
                    ) : (
                        <span>Remove</span>
                    )}
                </button>
                )
            )}
            </div>
        </div>
    </div>
  )
}

export default Usersitem