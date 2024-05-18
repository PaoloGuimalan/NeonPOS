import React, { useState } from 'react'
import { DeletePermissionRequest } from '../../helpers/https/requests';
import sign from 'jwt-encode';
import { AuthenticationInterface, SettingsInterface } from '../../helpers/typings/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { JWT_SECRET } from '../../helpers/typings/keys';
import { dispatchnewalert } from '../../helpers/reusables/alertdispatching';
import Buttonloader from '../loaders/buttonloader';
import { PermissionitemProp } from '../../helpers/typings/props';

function Permissionitem({ mp, GetPermissionsProcess, GetSpecificUserProcess }: PermissionitemProp) {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const settings: SettingsInterface = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();

  const [isPermissionDeleting, setisPermissionDeleting] = useState<boolean>(false);

  const DeletePermissionProcess = (prm_ID: string) => {
    setisPermissionDeleting(true);
    const encodedDeletingID = sign({userID: settings.userID, permissionID: prm_ID}, JWT_SECRET);
    DeletePermissionRequest(encodedDeletingID).then((response) => {
      if(response.data.status){
        GetPermissionsProcess();
        GetSpecificUserProcess();
        dispatchnewalert(dispatch, "success", response.data.message);
      }
      else{
        dispatchnewalert(dispatch, "error", response.data.message);
      }
      setisPermissionDeleting(false);
    }).catch((err) => {
      console.log(err);
      dispatchnewalert(dispatch, "error", "Error making deletion request");
      setisPermissionDeleting(false);
    })
  }

  return (
    <div className='bg-white border-[1px] p-[15px] flex w-full'>
        <div className='flex flex-1 gap-[10px] items-center'>
            <span className='text-[14px]'>{mp.permissionType}</span>
        </div>
        <div className='flex flex-1 flex-row gap-[5px]'>
            {mp.allowedUsers.map((mpp: string, ii: number) => {
            return (
                <div key={ii} className='text-[14px] bg-accent-tertiary text-white flex p-[5px] pl-[8px] pr-[8px]'>
                    <span>{mpp}</span>
                </div>
            )
            })}
        </div>
        <div className='w-full max-w-[180px] flex flex-row gap-[5px]'>
            <button className='bg-shade cursor-pointer flex flex-1 justify-center items-center h-[30px] shadow-sm h-[40px] text-white font-semibold rounded-[4px]'>
                <span className='text-[14px]'>{mp.isEnabled ? "Disable" : "Enable"}</span>
            </button>
            <button disabled={isPermissionDeleting} onClick={() => { DeletePermissionProcess(mp.permissionID) }} className='bg-red-500 cursor-pointer flex flex-1 justify-center items-center h-[30px] shadow-sm h-[40px] text-white font-semibold rounded-[4px]'>
            {isPermissionDeleting ? (
                <Buttonloader size='14px' />
            ) : (
                <span className='text-[14px]'>Delete</span>
            )}
            </button>
        </div>
    </div>
  )
}

export default Permissionitem