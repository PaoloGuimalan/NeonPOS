import React, { useState } from 'react'
import { AuthenticationInterface, CartItemInterface, SettingsInterface } from '../../helpers/typings/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchnewalert } from '../../helpers/reusables/alertdispatching';
import { arrayMax } from '../../helpers/reusables/numbersorters';
import { ProductitemProp } from '../../helpers/typings/props';
import { DeleteProductRequest } from '../../helpers/https/requests';
import Buttonloader from '../loaders/buttonloader';
import sign from 'jwt-encode';
import { JWT_SECRET } from '../../helpers/typings/keys';

function Productitem({ mp, cartlist, setcartlist, GetProductsListProcess }: ProductitemProp) {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const settings: SettingsInterface = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();

  const [isProductRemoving, setisProductRemoving] = useState<boolean>(false);

  const RemoveFromMenu = () => {
    if(authentication.user.permissions.includes("delete_menu")){
      setisProductRemoving(true);
      const encodedtoken = sign({ userID:  settings.userID, productID: mp.productID }, JWT_SECRET)
      DeleteProductRequest(encodedtoken).then((response) => {
        if(response.data.status){
            dispatchnewalert(dispatch, "success", `${mp.productID} has been deleted`);
            GetProductsListProcess();
        }
        else{
            dispatchnewalert(dispatch, "error", response.data.message);
        }
        setisProductRemoving(false);
      }).catch((err) => {
        dispatchnewalert(dispatch, "error", `Error request in deleting ${mp.productID}`);
        setisProductRemoving(false);
      })
    }
    else{
      dispatchnewalert(dispatch, "warning", "You do not have permission to remove menu");
    }
  }

  return (
    <div className='border-[1px] bg-white flex flex-col shadow-md flex flex-col p-[20px] h-fit w-full max-w-[280px] gap-[10px] select-none'>
        <div className='w-full'>
            <img src={mp.previews[0]} className='w-full h-[200px] max-w-[100%] select-none' />
        </div>
        <div className='w-full flex flex-col gap-[4px]'>
            <div className='w-full flex flex-row gap-[5px]'>
                <span className='text-[14px] font-semibold flex flex-1'>{mp.productName}</span>
                <div className='text-[12px] w-fit bg-orange-500 text-white flex p-[2px] pl-[8px] pr-[8px]'>
                    <span>&#8369; {mp.productPrice}</span>
                </div>
            </div>
            <div className='text-[12px] w-fit bg-accent-tertiary text-white flex p-[2px] pl-[8px] pr-[8px]'>
                <span>{mp.category}</span>
            </div>
        </div>
        <div className='w-full flex flex-row gap-[4px] pt-[10px]'>
        <button onClick={() => { setcartlist((prev: CartItemInterface[]) => {
            const prevfilter = prev.filter((flt: CartItemInterface) => flt.product.productID !== mp.productID);
            const getcurrentinput = prev.filter((flt: CartItemInterface) => flt.product.productID === mp.productID);
            const addedquantity = getcurrentinput.length > 0 ? getcurrentinput[0].quantity + 1 : 1
            const generatePendingID = getcurrentinput.length > 0 ? getcurrentinput[0].pendingID : cartlist.length > 0 ? arrayMax(cartlist.map((mp) => mp.pendingID)) + 1 : 1;
                              
            return [...prevfilter, { pendingID: generatePendingID, product: mp, quantity: addedquantity }]
        })}}
        style={{
            maxWidth: authentication.user.permissions.includes("delete_menu") ? "100px" : "none"
        }}
        className='bg-green-500 cursor-pointer flex flex-1 justify-center items-center h-[35px] shadow-sm text-white font-semibold rounded-[4px]'>
            <span className='text-[12px]'>Add to Cart</span>
        </button>
        {authentication.user.permissions.includes("delete_menu") && (
            <button disabled={isProductRemoving} onClick={RemoveFromMenu} className='bg-red-500 cursor-pointer flex flex-1 justify-center items-center h-[35px] shadow-sm text-white font-semibold rounded-[4px]'>
                {isProductRemoving ? (
                    <Buttonloader size='14px' />
                ) : (
                    <span className='text-[12px]'>Remove from Menu</span>
                )}
            </button>
        )}
        </div>
    </div>
  )
}

export default Productitem