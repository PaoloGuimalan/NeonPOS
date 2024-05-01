import React, { useEffect, useState } from 'react'
import { CreateNewPermissionRequest, GetPermissionsRequest } from '../../../../helpers/https/requests'
import { PermissionInterface } from '../../../../helpers/typings/interfaces'
import { IoClose } from 'react-icons/io5';

function Permissions() {

  const [permissions, setpermissions] = useState<PermissionInterface[]>([]);

  const [permissionType, setpermissionType] = useState<string>("");
  const [allowedusers, setallowedusers] = useState<string[]>([]);

  const GetPermissionsProcess = () => {
    GetPermissionsRequest().then((response) => {
      if(response.data.status){
        if(response.data.result){
          setpermissions(response.data.result);
        }
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const CreateNewPermissionProcess = () => {
    if(permissionType.trim() !== "" && allowedusers.length > 0){
      CreateNewPermissionRequest({
        permissionType: permissionType,
        allowedUsers: allowedusers
      }).then((response) => {
        if(response.data.status){
          GetPermissionsProcess();
          setpermissionType("");
          setallowedusers([]);
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  useEffect(() => {
    GetPermissionsProcess();
  },[])

  return (
    <div className='w-full flex flex-row bg-shade'>
        <div className='flex flex-1 flex-col p-[20px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Permissions</span>
            <div className='w-full flex flex-col gap-[0px] bg-white p-[15px] pt-[0px] h-full overflow-y-scroll'>
                <div className='pt-[20px] sticky top-0 bg-white'>
                  <div className='bg-header border-[1px] p-[15px] flex flex-row'>
                    <span className='text-[15px] flex flex-1 font-semibold'>Type</span>
                    <span className='text-[15px] flex flex-1 font-semibold'>Allowed Users</span>
                    <span className='text-[15px] flex font-semibold w-full max-w-[180px]'>Actions</span>
                  </div>
                </div>
                {permissions.map((mp: PermissionInterface, i: number) => {
                  return(
                    <div key={i} className='bg-white border-[1px] p-[15px] flex w-full'>
                      <div className='flex flex-1 gap-[10px] items-center'>
                        <span className='text-[14px]'>{mp.permissionType}</span>
                      </div>
                      <div className='flex flex-1 flex-row gap-[5px]'>
                        {mp.allowedUsers.map((mpp: string, i: number) => {
                          return (
                            <div className='text-[14px] bg-accent-tertiary text-white flex p-[5px] pl-[8px] pr-[8px]'>
                              <span>{mpp}</span>
                            </div>
                          )
                        })}
                      </div>
                      <div className='w-full max-w-[180px] flex flex-row gap-[5px]'>
                        <button className='bg-shade cursor-pointer flex flex-1 justify-center items-center h-[30px] shadow-sm h-[40px] text-white font-semibold rounded-[4px]'>
                          <span className='text-[14px]'>{mp.isEnabled ? "Disable" : "Enable"}</span>
                        </button>
                        <button className='bg-red-500 cursor-pointer flex flex-1 justify-center items-center h-[30px] shadow-sm h-[40px] text-white font-semibold rounded-[4px]'>
                          <span className='text-[14px]'>Delete</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>
        </div>
        <div className='w-full max-w-[450px] bg-shade p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Add Permission</span>
            <div className='w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit'>
                <div className='w-full flex flex-col gap-[5px]'>
                  <span className='text-[15px] font-semibold'>Permission Type</span>
                  <input type='text' value={permissionType} onChange={(e) => { setpermissionType(e.target.value) }} placeholder='Input a permission' className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' />
                </div>
                <div className='w-full flex flex-col gap-[5px]'>
                  <span className='text-[15px] font-semibold'>Allowed Users</span>
                  <div className='w-full flex flex-row gap-[5px]'>
                    {allowedusers.map((mp: string, i: number) => {
                      return (
                        <div key={i} className='bg-accent-tertiary flex flex-row items-center p-[7px] pl-[15px] rounded-[10px]'>
                          <span className='text-[14px] text-white'>{mp}</span>
                          <button className='btn_remove_selected' onClick={() => {
                            const newsetofusers = allowedusers.filter((flt: string) => flt !== mp);
                            setallowedusers(newsetofusers);
                          }}>
                              <IoClose style={{ fontSize: "17px", color: "white" }} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <div className='bg-shade p-[20px] flex flex-col gap-[5px]'>
                    <div className='bg-white w-full p-[10px] flex flex-row h-[60px] gap-[10px] items-center'>
                      <input type='checkbox' checked={allowedusers.includes("Admin")} onChange={(e) => {
                        if(e.target.checked){
                          setallowedusers((prev) => [...prev, "Admin"]);
                        }
                        else{
                          const newsetofusers = allowedusers.filter((flt: string) => flt !== "Admin");
                          setallowedusers(newsetofusers);
                        }
                      }} />
                      <span className='text-[14px]'>Admin / Developer / Technician</span>
                    </div>
                    <div className='bg-white w-full p-[10px] flex flex-row h-[60px] gap-[10px] items-center'>
                      <input type='checkbox' checked={allowedusers.includes("Manager")} onChange={(e) => {
                        if(e.target.checked){
                          setallowedusers((prev) => [...prev, "Manager"]);
                        }
                        else{
                          const newsetofusers = allowedusers.filter((flt: string) => flt !== "Manager");
                          setallowedusers(newsetofusers);
                        }
                      }} />
                      <span className='text-[14px]'>Manager</span>
                    </div>
                    <div className='bg-white w-full p-[10px] flex flex-row h-[60px] gap-[10px] items-center'>
                      <input type='checkbox' checked={allowedusers.includes("Waiter")} onChange={(e) => {
                        if(e.target.checked){
                          setallowedusers((prev) => [...prev, "Waiter"]);
                        }
                        else{
                          const newsetofusers = allowedusers.filter((flt: string) => flt !== "Waiter");
                          setallowedusers(newsetofusers);
                        }
                      }} />
                      <span className='text-[14px]'>Waiter</span>
                    </div>
                    <div className='bg-white w-full p-[10px] flex flex-row h-[60px] gap-[10px] items-center'>
                      <input type='checkbox' checked={allowedusers.includes("Cashier")} onChange={(e) => {
                        if(e.target.checked){
                          setallowedusers((prev) => [...prev, "Cashier"]);
                        }
                        else{
                          const newsetofusers = allowedusers.filter((flt: string) => flt !== "Cashier");
                          setallowedusers(newsetofusers);
                        }
                      }} />
                      <span className='text-[14px]'>Cashier</span>
                    </div>
                  </div>
                </div>
                <div className='w-full h-fit flex flex-col gap-[5px] pt-[10px]'>
                  <button onClick={CreateNewPermissionProcess} className='h-[30px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Add</span>
                  </button>
                  <button className='h-[30px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Clear</span>
                  </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Permissions;