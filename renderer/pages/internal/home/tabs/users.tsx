import React, { useEffect, useState } from 'react'
import { GetUsersRequest, RegisterAccountRequest } from '../../../../helpers/https/requests';
import { AuthenticationInterface, UserAccountInterface } from '../../../../helpers/typings/interfaces';
import { useSelector } from 'react-redux';

function Users() {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);

  const [userslist, setuserslist] = useState<UserAccountInterface[]>([]);

  const [firstname, setfirstname] = useState<string>("");
  const [middlename, setmiddlename] = useState<string>("");
  const [lastname, setlastname] = useState<string>("");

  const [accountType, setaccountType] = useState<string>("");

  const [password, setpassword] = useState<string>("");
  const [confirmpassword, setconfirmpassword] = useState<string>("");

  const GetUsersProcess = () => {
    GetUsersRequest().then((response) => {
      if(response.data.status){
        if(response.data.result){
          setuserslist(response.data.result);
        }
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const ClearFields = () => {
    setfirstname("");
    setmiddlename("");
    setlastname("");
    setpassword("");
    setconfirmpassword("");
  }

  const RegisterAccountProcess = () => {
    if((password === confirmpassword) && password.trim() !== ""){
      if(firstname.trim() !== "" && lastname.trim() !== "" && accountType !== "--Select Type--"){
        RegisterAccountRequest({
          firstname: firstname,
          middlename: middlename,
          lastname: lastname,
          accountType: accountType,
          password: password,
          creatorAccountID: authentication.user.accountID
        }).then((response) => {
          if(response.data.status){
            GetUsersProcess();
            ClearFields();
          }
        }).catch((err) => {
          console.log(err);
        })
      }
    }
  }

  useEffect(() => {
    GetUsersProcess();
  },[]);

  return (
    <div className='w-full flex flex-row bg-shade'>
        <div className='flex flex-1 flex-col p-[20px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Users</span>
            <div className='w-full flex flex-row gap-[5px] p-[15px] pt-[15px] h-full overflow-y-scroll'>
                <div className='w-full h-fit flex flex-row flex-wrap gap-[7px]'>
                  {userslist.map((mp: UserAccountInterface, i: number) => {
                    return(
                      <div key={i} className='bg-white shadow-md flex flex-col p-[20px] h-fit w-full max-w-[350px]'>
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
                            <button className='text-[14px] w-fit bg-orange-500 text-white flex p-[5px] pl-[8px] pr-[8px] rounded-[4px]'>
                              <span>Disable</span>
                            </button>
                            <button className='text-[14px] w-fit bg-red-500 text-white flex p-[5px] pl-[8px] pr-[8px] rounded-[4px]'>
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
            </div>
        </div>
        <div className='w-full max-w-[450px] bg-shade p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Add a User</span>
            <div className='w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit'>
                <div className='w-full flex flex-col gap-[5px]'>
                  <span className='text-[15px] font-semibold'>First Name</span>
                  <input type='text' value={firstname} onChange={(e) => { setfirstname(e.target.value) }} placeholder='Input user first name' className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' />
                  <span className='text-[15px] font-semibold'>Middle Name</span>
                  <input type='text' value={middlename} onChange={(e) => { setmiddlename(e.target.value) }} placeholder='Input user middle name (optional)' className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' />
                  <span className='text-[15px] font-semibold'>Last Name</span>
                  <input type='text' value={lastname} onChange={(e) => { setlastname(e.target.value) }} placeholder='Input user last name' className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' />
                </div>
                <div className='w-full flex flex-col gap-[5px]'>
                  <span className='text-[15px] font-semibold'>Account Type</span>
                  <div className='w-full flex flex-row gap-[5px]'>
                    <select value={accountType} onChange={(e) => { setaccountType(e.target.value) }} className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' >
                      <option value={null}>--Select Type--</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Waiter">Waiter</option>
                    </select>
                  </div>
                </div>
                <div className='w-full flex flex-col gap-[5px]'>
                  <span className='text-[15px] font-semibold'>Password</span>
                  <input type='password' value={password} onChange={(e) => { setpassword(e.target.value) }} placeholder='Input desired password' className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' />
                  <span className='text-[15px] font-semibold'>Confirm Password</span>
                  <input type='password' value={confirmpassword} onChange={(e) => { setconfirmpassword(e.target.value) }} placeholder='Input desired password' className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' />
                </div>
                <div className='w-full h-fit flex flex-col gap-[5px] pt-[10px]'>
                  <button onClick={RegisterAccountProcess} className='h-[30px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Add</span>
                  </button>
                  <button onClick={ClearFields} className='h-[30px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Clear</span>
                  </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Users