import React, { useEffect, useMemo, useState } from 'react'
import { IoCartSharp } from 'react-icons/io5';
import { MdAddToPhotos, MdClose } from 'react-icons/md';
import { AuthenticationInterface, CartItemInterface, ProductDataInterface } from '../../../../helpers/typings/interfaces';
import { useSelector } from 'react-redux';
import { AddProductRequest, GetProductsListRequest } from '../../../../helpers/https/requests';
import Confirmordermodal from '../../../../components/modals/confirmordermodal';
import { motion } from 'framer-motion';

function Menu() {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);

  const [togglewidget, settogglewidget] = useState<string>("cart");
  const [productlist, setproductlist] = useState<ProductDataInterface[]>([]);

  const [productName, setproductName] = useState<string>("");
  const [productPrice, setproductPrice] = useState<number>(0);
  const [productQuantity, setproductQuantity] = useState<number>(0);
  const [category, setcategory] = useState<string>("");

  const [cartlist, setcartlist] = useState<CartItemInterface[]>([]);
  const [amountreceived, setamountreceived] = useState<number>(0);

  const [confirmmodaltrigger, setconfirmmodaltrigger] = useState<boolean>(false);
  const [passcode, setpasscode] = useState<string>("");

  const cartTotalHolder = useMemo(() => cartlist.map((mp: CartItemInterface) => (mp.product.productPrice * mp.quantity)).reduce(function(a, b) { return a + b; }, 0), [cartlist]);

  const ClearAddProductFields = () => {
    setproductName("");
    setproductPrice(0);
    setproductQuantity(0);
    setcategory("");
  }

  const GetProductsListProcess = () => {
    GetProductsListRequest().then((response) => {
      if(response.data.status){
        setproductlist(response.data.result);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const AddProductProcess = () => {
    if(productName.trim() !== "" && productPrice > 0 && productQuantity > 0 && category !== "--Select Category--"){
      AddProductRequest({
        productName: productName,
        productPrice: productPrice,
        productQuantity: productQuantity,
        accountID: authentication.user.accountID,
        category: category
      }).then((response) => {
        if(response.data.status){
          GetProductsListProcess();
          ClearAddProductFields();
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  const ConfirmOrder = () => {
    if(cartlist.length > 0 && amountreceived >= cartTotalHolder){
      setconfirmmodaltrigger(true);
    }
  }

  const FinalizeOrder = () => {
    console.log(passcode);
  }

  useEffect(() => {
    GetProductsListProcess();
  },[]);

  return (
    <div className='w-full flex flex-row bg-shade'>
        {confirmmodaltrigger && (
          <Confirmordermodal children={
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} className='bg-white w-[95%] h-[95%] max-w-[900px] max-h-[700px] p-[20px] rounded-[7px] flex flex-col'>
              <div className='w-full flex flex-row'>
                <div className='flex flex-1'>
                  <span className='text-[16px] font-semibold'>Current Order</span>
                </div>
                <div className='w-fit'>
                  <button onClick={() => { setconfirmmodaltrigger(false); setpasscode(""); }}><MdClose /></button>
                </div>
              </div>
              <div className='w-full h-[calc(100%-20px)] flex flex-1 flex-row'>
                <div className='w-[60%] h-full'>
                  <div className='w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-full'>
                      <div className='bg-shade p-[20px] flex flex-1 flex-col gap-[7px] overflow-y-scroll'>
                        {cartlist.map((mp: CartItemInterface, i: number) => {
                          return(
                            <div key={i} className='w-full flex flex-row bg-white p-[10px] min-h-[90px] gap-[7px] shadow-md select-none'>
                              <img src={mp.product.previews[0]} className='h-full max-w-[80px]' />
                              <div className='flex flex-1 flex-col'>
                                <div className='w-full flex flex-row'>
                                  <span className='text-[14px] font-semibold flex flex-1'>{mp.product.productName}</span>
                                  <span className='text-[14px]'>&#8369; {mp.product.productPrice} x {mp.quantity}</span>
                                </div>
                                <div className='w-full flex flex-row pt-[25px]'>
                                  <span className='text-[14px] flex flex-1'>Total: &#8369; {mp.product.productPrice * mp.quantity}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className='bg-shade p-[10px] flex flex-col gap-[5px]'>
                        <div className='w-full bg-white p-[10px] flex flex-col'>
                          <span className='text-[14px] font-semibold'>Cart Total: &#8369; {cartTotalHolder}</span>
                          <div className='w-full flex flex-row'>
                            <span className='text-[14px] font-semibold'>Ammount Received: &#8369; {amountreceived}</span>
                          </div>
                          <span className='text-[14px] font-semibold'>Change: &#8369; {amountreceived - cartTotalHolder}</span>
                        </div>
                      </div>
                  </div>
                </div>
                <div className='w-[40%] h-full flex flex-col items-center overflow-y-auto thinscroller'>
                  <div className='w-full flex flex-1 pt-[20px]'>
                    <div className='w-full flex flex-1 flex-col items-center gap-[10px]'>
                      <input type='password' value={passcode} disabled placeholder='Enter your passcode' className='w-full h-[80px] bg-shade pl-[15px] pr-[15px] text-center rounded-[7px] shadow-md' />
                      <div className='bg-shade w-full flex flex-wrap flex-1 p-[20px] gap-[4px] items-center justify-center overflow-y-auto thinscroller rounded-[7px]'>
                        <button className='bg-white w-full max-w-[95px] h-full max-h-[95px] text-[27px] font-semibold rounded-[7px] shadow-md' onClick={() => { setpasscode((prev) => `${prev}1`) }}>1</button>
                        <button className='bg-white w-full max-w-[95px] h-full max-h-[95px] text-[27px] font-semibold rounded-[7px] shadow-md' onClick={() => { setpasscode((prev) => `${prev}2`) }}>2</button>
                        <button className='bg-white w-full max-w-[95px] h-full max-h-[95px] text-[27px] font-semibold rounded-[7px] shadow-md' onClick={() => { setpasscode((prev) => `${prev}3`) }}>3</button>
                        <button className='bg-white w-full max-w-[95px] h-full max-h-[95px] text-[27px] font-semibold rounded-[7px] shadow-md' onClick={() => { setpasscode((prev) => `${prev}4`) }}>4</button>
                        <button className='bg-white w-full max-w-[95px] h-full max-h-[95px] text-[27px] font-semibold rounded-[7px] shadow-md' onClick={() => { setpasscode((prev) => `${prev}5`) }}>5</button>
                        <button className='bg-white w-full max-w-[95px] h-full max-h-[95px] text-[27px] font-semibold rounded-[7px] shadow-md' onClick={() => { setpasscode((prev) => `${prev}6`) }}>6</button>
                        <button className='bg-white w-full max-w-[95px] h-full max-h-[95px] text-[27px] font-semibold rounded-[7px] shadow-md' onClick={() => { setpasscode((prev) => `${prev}7`) }}>7</button>
                        <button className='bg-white w-full max-w-[95px] h-full max-h-[95px] text-[27px] font-semibold rounded-[7px] shadow-md' onClick={() => { setpasscode((prev) => `${prev}8`) }}>8</button>
                        <button className='bg-white w-full max-w-[95px] h-full max-h-[95px] text-[27px] font-semibold rounded-[7px] shadow-md' onClick={() => { setpasscode((prev) => `${prev}9`) }}>9</button>
                        <button className='bg-white w-full max-w-[95px] h-full max-h-[95px] text-[27px] font-semibold rounded-[7px] shadow-md' onClick={() => { setpasscode((prev) => `${prev}0`) }}>0</button>
                      </div>
                    </div>
                  </div>
                  <div className='w-full h-fit flex flex-col gap-[5px] pt-[10px]'>
                    <button onClick={FinalizeOrder} className='h-[35px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                      <span className='text-[14px]'>Finalize</span>
                    </button>
                    <button onClick={() => {
                      setpasscode("");
                    }} className='h-[30px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                      <span className='text-[14px]'>Clear Passcode</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          } />
        )}
        <div className='flex flex-1 flex-col p-[20px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Menu</span>
            <div className='w-full flex flex-row gap-[7px]'>
              <button onClick={() => { settogglewidget("cart") }} className='text-text-secondary min-h-[40px] min-w-[130px] pl-[10px] pr-[10px] bg-white cursor-pointer shadow-sm rounded-[4px] flex flex-row items-center justify-center gap-[5px]'>
                <IoCartSharp style={{ fontSize: "20px" }} />
                <span className='text-[14px]'>Cart</span>
              </button>
              <button onClick={() => { settogglewidget("add_product") }} className='text-text-secondary min-h-[40px] min-w-[130px] pl-[10px] pr-[10px] bg-white cursor-pointer shadow-sm rounded-[4px] flex flex-row items-center justify-center gap-[5px]'>
                <MdAddToPhotos style={{ fontSize: "20px" }} />
                <span className='text-[14px]'>Add Product</span>
              </button>
            </div>
            <div className='w-full flex flex-row gap-[5px] p-[15px] pt-[15px] pl-[0px] pr-[0px] h-full overflow-y-scroll'>
                <div className='w-full h-fit flex flex-row flex-wrap gap-[7px]'>
                  {productlist.map((mp: ProductDataInterface, i: number) => {
                    return(
                      <div key={i} className='bg-white flex flex-col shadow-md flex flex-col p-[20px] h-fit w-full max-w-[350px] gap-[10px] select-none'>
                        <div className='w-full'>
                          <img src={mp.previews[0]} className='w-full min-h-[200px] max-w-[100%] select-none' />
                        </div>
                        <div className='w-full flex flex-col gap-[4px]'>
                          <div className='w-full flex flex-row gap-[5px]'>
                            <span className='text-[17px] font-semibold flex flex-1'>{mp.productName}</span>
                            <div className='text-[15px] w-fit bg-orange-500 text-white flex p-[2px] pl-[8px] pr-[8px]'>
                              <span>&#8369; {mp.productPrice}</span>
                            </div>
                          </div>
                          <div className='text-[14px] w-fit bg-accent-tertiary text-white flex p-[2px] pl-[8px] pr-[8px]'>
                            <span>{mp.category}</span>
                          </div>
                        </div>
                        <div className='w-full flex flex-row gap-[4px] pt-[10px]'>
                          <button onClick={() => { setcartlist((prev) => {
                            const prevfilter = prev.filter((flt: CartItemInterface) => flt.product.productID !== mp.productID);
                            const getcurrentinput = prev.filter((flt: CartItemInterface) => flt.product.productID === mp.productID);
                            const addedquantity = getcurrentinput.length > 0 ? getcurrentinput[0].quantity + 1 : 1
                            
                            return [...prevfilter, { product: mp, quantity: addedquantity }]
                          })}} className='bg-green-500 cursor-pointer flex flex-1 justify-center items-center h-[35px] shadow-sm text-white font-semibold rounded-[4px]'>
                            <span className='text-[14px]'>Add to Cart</span>
                          </button>
                          <button className='bg-red-500 cursor-pointer flex flex-1 justify-center items-center h-[35px] shadow-sm text-white font-semibold rounded-[4px]'>
                            <span className='text-[14px]'>Remove from Menu</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
            </div>
        </div>
        {togglewidget === "cart" && (
          <div className='w-full max-w-[450px] bg-shade p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Cart</span>
            <div className='w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit'>
                <div className='bg-shade p-[20px] flex flex-col gap-[7px] h-[400px] overflow-y-scroll'>
                  {cartlist.map((mp: CartItemInterface, i: number) => {
                    return(
                      <div key={i} className='w-full flex flex-row bg-white p-[10px] min-h-[90px] gap-[7px] shadow-md select-none'>
                        <img src={mp.product.previews[0]} className='h-full max-w-[80px]' />
                        <div className='flex flex-1 flex-col'>
                          <div className='w-full flex flex-row'>
                            <span className='text-[14px] font-semibold flex flex-1'>{mp.product.productName}</span>
                            <span className='text-[14px]'>&#8369; {mp.product.productPrice} x {mp.quantity}</span>
                          </div>
                          <div className='w-full flex flex-row'>
                            <span className='text-[14px] flex flex-1'>Total: &#8369; {mp.product.productPrice * mp.quantity}</span>
                          </div>
                          <div className='w-full flex flex-row justify-end gap-[5px]'>
                            <button onClick={() => { setcartlist((prev) => {
                              const prevfilter = prev.filter((flt: CartItemInterface) => flt.product.productID !== mp.product.productID);
                              const getcurrentinput = prev.filter((flt: CartItemInterface) => flt.product.productID === mp.product.productID);
                              const minusquantity = getcurrentinput.length > 0 ? getcurrentinput[0].quantity - 1 : 0
                              
                              if(minusquantity > 0){
                                return [...prevfilter, { product: mp.product, quantity: minusquantity }]
                              }
                              else{
                                return prevfilter;
                              }
                            }) }} className='bg-orange-500 cursor-pointer flex flex-1 justify-center items-center h-[25px] shadow-sm text-white font-semibold rounded-[4px]'>
                              <span className='text-[14px]'>Minus</span>
                            </button>
                            <button onClick={() => { setcartlist((prev) => {
                              const prevfilter = prev.filter((flt: CartItemInterface) => flt.product.productID !== mp.product.productID);
                              
                              return prevfilter;
                            }) }} className='bg-red-500 cursor-pointer flex flex-1 justify-center items-center h-[25px] shadow-sm text-white font-semibold rounded-[4px]'>
                              <span className='text-[14px]'>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className='bg-shade p-[10px] flex flex-col gap-[5px]'>
                  <div className='w-full bg-white p-[10px] flex flex-col'>
                    <span className='text-[14px] font-semibold'>Cart Total: &#8369; {cartTotalHolder}</span>
                    <div className='w-full flex flex-row'>
                      <span className='text-[14px] font-semibold'>Ammount Received: &#8369; </span>
                      <input type='number' value={amountreceived} onChange={(e) => { setamountreceived(parseInt(e.target.value)) }} min={0} step={1} placeholder='Input amount received' className='flex flex-1 h-[20px] pl-[5px] pr-[5px] text-[14px] outline-none' />
                    </div>
                    <span className='text-[14px] font-semibold'>Change: &#8369; {amountreceived - cartTotalHolder}</span>
                  </div>
                </div>
                <div className='w-full h-fit flex flex-col gap-[5px] pt-[10px]'>
                  <button onClick={ConfirmOrder} className='h-[30px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Confirm</span>
                  </button>
                  <button onClick={() => {
                    setcartlist([]);
                    setamountreceived(0);
                  }} className='h-[30px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Clear</span>
                  </button>
                </div>
            </div>
        </div>
        )}
        {togglewidget === "add_product" && (
          <div className='w-full max-w-[450px] bg-shade p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Add Product</span>
            <div className='w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit'>
                <div className='w-full flex flex-col gap-[5px]'>
                  <span className='text-[15px] font-semibold'>Product Name</span>
                  <input type='text' value={productName} onChange={(e) => { setproductName(e.target.value) }} placeholder='Input product name' className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' />
                  <span className='text-[15px] font-semibold'>Price</span>
                  <input type='number' value={productPrice} min="0" step="1" onChange={(e) => { setproductPrice(parseInt(e.target.value)) }} placeholder='Input price' className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' />
                  <span className='text-[15px] font-semibold'>Quantity</span>
                  <input type='number' value={productQuantity} min="0" step="1" onChange={(e) => { setproductQuantity(parseInt(e.target.value)) }} placeholder='Input quantity' className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' />
                </div>
                <div className='w-full flex flex-col gap-[5px]'>
                  <span className='text-[15px] font-semibold'>Product Category</span>
                  <div className='w-full flex flex-row gap-[5px]'>
                    <select value={category} onChange={(e) => { setcategory(e.target.value) }} className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' >
                      <option value={null}>--Select Category--</option>
                      <option value="Meals">Meals</option>
                      <option value="Beverage">Beverage</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Pasta">Pasta</option>
                      <option value="Pastry">Pastry</option>
                      <option value="Soup">Soup</option>
                      <option value="Extra">Extra</option>
                    </select>
                  </div>
                </div>
                <div className='w-full h-fit flex flex-col gap-[5px] pt-[10px]'>
                  <button onClick={AddProductProcess} className='h-[30px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Add</span>
                  </button>
                  <button onClick={ClearAddProductFields} className='h-[30px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Clear</span>
                  </button>
                </div>
            </div>
        </div>
        )}
    </div>
  )
}

export default Menu