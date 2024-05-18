import React, { useEffect, useState } from 'react'
import { GetUsersRequest, RegisterAccountRequest } from '../../../../helpers/https/requests';
import { AuthenticationInterface, SettingsInterface, UserAccountInterface } from '../../../../helpers/typings/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchnewalert } from '../../../../helpers/reusables/alertdispatching';
import Pageloader from '../../../../components/holders/pageloader';
import Usersitem from '../../../../components/widgets/usersitem';

function Users() {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const settings: SettingsInterface = useSelector((state: any) => state.settings);

  const dispatch = useDispatch();

  const [userslist, setuserslist] = useState<UserAccountInterface[]>([]);

  const [firstname, setfirstname] = useState<string>("");
  const [middlename, setmiddlename] = useState<string>("");
  const [lastname, setlastname] = useState<string>("");

  const [accountType, setaccountType] = useState<string>("");

  const [password, setpassword] = useState<string>("");
  const [confirmpassword, setconfirmpassword] = useState<string>("");

  const GetUsersProcess = () => {
    GetUsersRequest(settings.userID).then((response) => {
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
    if((password === confirmpassword) && password.trim() !== "" && authentication.user.permissions.includes("add_new_user")){
      if(firstname.trim() !== "" && lastname.trim() !== "" && accountType !== "--Select Type--"){
        RegisterAccountRequest({
          firstname: firstname,
          middlename: middlename,
          lastname: lastname,
          accountType: accountType,
          password: password,
          creatorAccountID: authentication.user.accountID,
          deviceID: settings.deviceID,
          userID: settings.userID
        }).then((response) => {
          if(response.data.status){
            GetUsersProcess();
            ClearFields();
          }
        }).catch((err) => {
          console.log(err);
        })
      }
      else{
        dispatchnewalert(dispatch, "warning", "Please complete the fields");
      }
    }
    else{
      dispatchnewalert(dispatch, "warning", "Please ensure of completing the fields or having permission");
    }
  }

  useEffect(() => {
    GetUsersProcess();
  },[settings]);

  return (
    <div className='w-full flex flex-row bg-shade font-Inter'>
        <div className='flex flex-1 flex-col p-[20px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Users</span>
            <div className='w-full flex flex-row gap-[5px] p-[15px] pt-[15px] h-full overflow-y-scroll'>
                {userslist.length > 0 ? (
                  <div className='w-full h-fit flex flex-row flex-wrap gap-[7px]'>
                  {userslist.map((mp: UserAccountInterface, i: number) => {
                    return(
                      <Usersitem key={i} mp={mp} GetUsersProcess={GetUsersProcess} />
                    )
                  })}
                </div>
                ) : (
                  <Pageloader />
                )}
            </div>
        </div>
        {authentication.user.permissions.includes("add_new_user") && (
          <div className='w-full max-w-[450px] bg-shade p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Add a User</span>
              <div className='shadow-lg border-[1px] w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit'>
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
        )}
    </div>
  )
}

export default Users