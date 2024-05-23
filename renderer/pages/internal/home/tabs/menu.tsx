import React, { useEffect, useMemo, useState } from 'react'
import { IoCartSharp } from 'react-icons/io5';
import { MdAddToPhotos, MdClose } from 'react-icons/md';
import { TbCategoryPlus } from "react-icons/tb";
import { AuthenticationInterface, CartItemInterface, CategoriesListInterface, ProductDataInterface, ReceiptHolderInterface, SettingsInterface } from '../../../../helpers/typings/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { AddProductRequest, CreateCategoryRequest, CreateOrderRequest, GetCategoriesListRequest, GetProductsListRequest, LoginRequest } from '../../../../helpers/https/requests';
import ReusableModal from '../../../../components/modals/reusablemodal';
import { motion } from 'framer-motion';
import { dispatchnewalert } from '../../../../helpers/reusables/alertdispatching';
import { arrayMax } from '../../../../helpers/reusables/numbersorters';
import { dateGetter, timeGetter } from '../../../../helpers/reusables/generatefns';
import Buttonloader from '../../../../components/loaders/buttonloader';
import Pageloader from '../../../../components/holders/pageloader';
import sign from 'jwt-encode';
import { JWT_SECRET } from '../../../../helpers/typings/keys';
import Productitem from '../../../../components/widgets/productitem';

function Menu() {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const settings: SettingsInterface = useSelector((state: any) => state.settings);

  const [isOrderVoided, setisOrderVoided] = useState<boolean>(false);
  const [previousOrderID, setpreviousOrderID] = useState<string>("");
  const [discount, setdiscount] = useState<number>(0);

  const [togglewidget, settogglewidget] = useState<string>("cart");
  const [productlist, setproductlist] = useState<ProductDataInterface[]>([]);
  const [categorieslist, setcategorieslist] = useState<CategoriesListInterface[]>([]);

  const [categoryFilter, setcategoryFilter] = useState<string>("All");

  const [isFinalizingOrder, setisFinalizingOrder] = useState<boolean>(false);
  const [isSubmittingNewProduct, setisSubmittingNewProduct] = useState<boolean>(false);

  const [tableNumber, settableNumber] = useState<number>(0);

  const [productName, setproductName] = useState<string>("");
  const [productPrice, setproductPrice] = useState<number>(0);
  const [productQuantity, setproductQuantity] = useState<number>(0);
  const [category, setcategory] = useState<string>("");

  const [categoryName, setcategoryName] = useState<string>("");
  const [isCategorySaving, setisCategorySaving] = useState<boolean>(false);

  const [cartlist, setcartlist] = useState<CartItemInterface[]>([]);
  const [amountreceived, setamountreceived] = useState<number>(0);

  const [confirmmodaltrigger, setconfirmmodaltrigger] = useState<boolean>(false);
  const [passcode, setpasscode] = useState<string>("");

  const cartTotalHolder = useMemo(() => cartlist.map((mp: CartItemInterface) => (mp.product.productPrice * mp.quantity)).reduce(function(a, b) { return a + b; }, 0), [cartlist]);

  const dispatch = useDispatch();

  const ClearAddProductFields = () => {
    setproductName("");
    setproductPrice(0);
    setproductQuantity(0);
    setcategory("");
  }

  const ClearCartFields = () => {
    setcartlist([]);
    setamountreceived(0);
    setpasscode("");
    setdiscount(0);
    setisOrderVoided(false);
    setpreviousOrderID("");
    settableNumber(0);
  }

  const GetProductsListProcess = () => {
    GetProductsListRequest(settings.userID).then((response) => {
      if(response.data.status){
        setproductlist(response.data.result);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const AddProductProcess = () => {
    if(productName.trim() !== "" && productPrice > 0 && productQuantity > 0 && category !== "--Select Category--"){
      setisSubmittingNewProduct(true);
      AddProductRequest({
        productName: productName,
        productPrice: productPrice,
        productQuantity: productQuantity,
        accountID: authentication.user.accountID,
        category: category,
        deviceID: settings.deviceID,
        userID: settings.userID
      }).then((response) => {
        setisSubmittingNewProduct(false);
        if(response.data.status){
          GetProductsListProcess();
          ClearAddProductFields();
        }
      }).catch((err) => {
        setisSubmittingNewProduct(false);
        console.log(err);
      })
    }
    else{
      dispatchnewalert(dispatch, "warning", "Please complete the fields");
    }
  }

  const ConfirmOrder = () => {
    if(cartlist.length > 0 && ((amountreceived >= cartTotalHolder) || (amountreceived == 0)) && (tableNumber !== 0) && (discount === 0 || discount >= 0)){
      setconfirmmodaltrigger(true);
    }
    else{
      dispatchnewalert(dispatch, "warning", "Order is still incomplete");
    }
  }

  const SubmitOrder = () => {
    CreateOrderRequest({
      orderSet: cartlist,
      totalAmount: cartTotalHolder,
      receivedAmount: amountreceived,
      timeMade: timeGetter(),
      dateMade: dateGetter(),
      status: amountreceived === 0 ? "Pending" : isOrderVoided ? "Renewed" : "Initial",
      tableNumber: tableNumber.toString(),
      voidedFrom: isOrderVoided ? previousOrderID : "",
      discount: discount,
      orderMadeBy: {
          accountID: authentication.user.accountID,
          userID: settings.userID,
          deviceID: settings.deviceID
      }
    }).then((response) => {
      if(response.data.status){
        dispatchnewalert(dispatch, "success", "Order has been saved");
        if(amountreceived === 0){
          const printTemplateData: ReceiptHolderInterface = {
            cashier: authentication.user.accountName.firstname,
            orderID: response.data.result.orderID,
            deviceID: settings.deviceID,
            date: dateGetter(),
            time: timeGetter(),
            cartlist: cartlist,
            total: cartTotalHolder.toFixed(2).toString(),
            amount: amountreceived.toFixed(2).toString(),
            change: (amountreceived - cartTotalHolder).toFixed(2).toString(),
            discount: discount.toFixed(0).toString(),
            isPending: true
          }
  
          window.ipc.send("ready-print", JSON.stringify(printTemplateData));
          setconfirmmodaltrigger(false);
          ClearCartFields();
        }
        else{
          //print cart list
          const printTemplateData: ReceiptHolderInterface = {
            cashier: authentication.user.accountName.firstname,
            orderID: response.data.result.orderID,
            deviceID: settings.deviceID,
            date: dateGetter(),
            time: timeGetter(),
            cartlist: cartlist,
            total: cartTotalHolder.toFixed(2).toString(),
            amount: amountreceived.toFixed(2).toString(),
            change: (amountreceived - cartTotalHolder).toFixed(2).toString(),
            discount: discount.toFixed(0).toString(),
            isPending: false,
          }
  
          window.ipc.send("ready-print", JSON.stringify(printTemplateData));
          setconfirmmodaltrigger(false);
          ClearCartFields();
        }
      }
      else{
        dispatchnewalert(dispatch, "warning", response.data.message);
      }
    }).catch((err) => {
      dispatchnewalert(dispatch, "error", "Error creating order");
    })
  }

  const FinalizeOrder = () => {
    // console.log(passcode);
    if(passcode.trim() !== ""){
      setisFinalizingOrder(true);
      LoginRequest({
        accountID: authentication.user.accountID,
        password: passcode,
        userID: settings.userID
      }).then((response) => {
        if(response.data.status){
          dispatchnewalert(dispatch, "success", "Passcode verified");
          SubmitOrder();
          setisFinalizingOrder(false);
        }
        else{
          dispatchnewalert(dispatch, "warning", "Incorrect passcode");
          setisFinalizingOrder(false);
        }
      }).catch((err) => {
        setisFinalizingOrder(false);
        dispatchnewalert(dispatch, "error", "Failed to verify passcode");
      })
    }
    else{
      dispatchnewalert(dispatch, "warning", "Please provide your passcode");
    }
  }

  const GetCategoriesListProcess = () => {
    const encodedsettings = sign({accountID: authentication.user.accountID, ...settings}, JWT_SECRET);
    GetCategoriesListRequest(encodedsettings).then((response) => {
      if(response.data.status){
        // alert(JSON.stringify(response.data));
        setcategorieslist(response.data.result);
      }
      else{
        dispatchnewalert(dispatch, "error", response.data.message);
      }
    }).catch((err) => {
      dispatchnewalert(dispatch, "error", "Error making categories list request");
      console.log(err);
    })
  }

  useEffect(() => {
    GetCategoriesListProcess();
    GetProductsListProcess();
  },[settings]);

  const BroadcastInvoice = () =>{
    window.ipc.send('display-invoice', JSON.stringify({
      cartlist: cartlist,
      total: cartTotalHolder,
      amountreceived: amountreceived,
      change: amountreceived - cartTotalHolder,
      discount: discount ? discount : 0
    }));
  }

  const AddCategoryProcess = () => {
    if(categoryName.trim() !== ""){
      setisCategorySaving(true);
      const encodedtoken = sign({
        categoryName: categoryName,
        from: {
            accountID: authentication.user.accountID,
            userID: settings.userID,
            deviceID: settings.deviceID
        }
      }, JWT_SECRET);
      CreateCategoryRequest(encodedtoken).then((response) => {
        if(response.data.status){
          GetCategoriesListProcess();
          setcategoryName("");
          dispatchnewalert(dispatch, "success", "A category has been created");
        }
        else{
          dispatchnewalert(dispatch, "error", response.data.message);
        }
        setisCategorySaving(false);
      }).catch((err) => {
        setisCategorySaving(false);
        dispatchnewalert(dispatch, "error", "Error making create category request");
        console.log(err);
      })
    }
    else{
      dispatchnewalert(dispatch, "warning", "Please provide a category name");
    }
  }

  useEffect(() => {
    BroadcastInvoice();

    return () => {
      window.ipc.send('display-invoice', null);
    }
  },[cartlist, amountreceived, cartTotalHolder, discount]);

  return (
    <div className='w-full flex flex-row bg-shade font-Inter'>
        {confirmmodaltrigger && (
          <ReusableModal shaded={true} padded={true} children={
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
                            <div key={i} title={mp.product.productName} className='w-full flex flex-row bg-white p-[10px] min-h-[90px] gap-[7px] shadow-md select-none'>
                              <img src={mp.product.previews[0]} className='h-full max-w-[80px]' />
                              <div className='flex flex-1 flex-col'>
                                <div className='w-full flex flex-row'>
                                  <span className='text-[14px] font-semibold flex flex-1 marquee'>{mp.product.productName}</span>
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
                          <div className='w-full flex flex-row'>
                            <span className='text-[14px] font-semibold'>Discount ({discount}%): &#8369; {cartTotalHolder * (discount / 100)}</span>
                          </div>
                          <span className='text-[14px] font-semibold'>Change: &#8369; {amountreceived - (cartTotalHolder - (cartTotalHolder * (discount / 100)))}</span>
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
                    <button disabled={isFinalizingOrder} onClick={FinalizeOrder} className='h-[35px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                      {isFinalizingOrder ? (
                        <Buttonloader size='14px' />
                      ) : (
                        <span className='text-[14px]'>Finalize</span>
                      )}
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
              {authentication.user.permissions.includes("add_menu") && (
                <button onClick={() => { settogglewidget("add_product") }} className='text-text-secondary min-h-[40px] min-w-[130px] pl-[10px] pr-[10px] bg-white cursor-pointer shadow-sm rounded-[4px] flex flex-row items-center justify-center gap-[5px]'>
                  <MdAddToPhotos style={{ fontSize: "20px" }} />
                  <span className='text-[14px]'>Add Product</span>
                </button>
              )}
              {authentication.user.permissions.includes("add_category") && (
                <button onClick={() => { settogglewidget("add_category") }} className='text-text-secondary min-h-[40px] min-w-[130px] pl-[10px] pr-[10px] bg-white cursor-pointer shadow-sm rounded-[4px] flex flex-row items-center justify-center gap-[5px]'>
                  <TbCategoryPlus style={{ fontSize: "20px" }} />
                  <span className='text-[14px]'>Add Category</span>
                </button>
              )}
              <div className='flex flex-1 justify-end'>
                <button onClick={() => {
                  setproductlist([]);
                  setcategorieslist([]);
                  GetCategoriesListProcess();
                  GetProductsListProcess();
                }} className='text-text-secondary min-h-[40px] min-w-[100px] pl-[10px] pr-[10px] bg-white cursor-pointer shadow-sm rounded-[4px] flex flex-row items-center justify-center gap-[5px]'>
                  <span className='text-[14px] font-semibold text-black'>Refresh</span>
                </button>
              </div>
            </div>
            <div className='w-full max-w-[calc(100vw-570px)] flex flex-row h-[50px]'>
                <div className='w-full flex flex-row gap-[2px] overflow-x-scroll overflow-y-hidden thinscroller pb-[5px]'>
                <motion.button
                  initial={{
                    backgroundColor: "white",
                    color: "black"
                  }}
                  animate={{
                    backgroundColor: categoryFilter === "All" ? "#12051c" : "white",
                    color: categoryFilter === "All" ? "white" : "black"
                  }}
                  onClick={() => { setcategoryFilter("All") }} className='rounded-[4px] w-fit min-w-[50px] bg-white border-[1px] shadow-md p-[2px] pl-[7px] pr-[7px]'>
                    <span className='text-[14px] font-Inter'>All</span>
                  </motion.button>
                  {categorieslist.map((mp: CategoriesListInterface, i: number) => {
                    return(
                      <motion.button
                      initial={{
                        backgroundColor: "white",
                        color: "black"
                      }}
                      animate={{
                        backgroundColor: categoryFilter === mp.categoryName ? "#12051c" : "white",
                        color: categoryFilter === mp.categoryName ? "white" : "black"
                      }}
                      key={i} onClick={() => { setcategoryFilter(mp.categoryName) }} className='rounded-[4px] w-fit min-w-fit bg-white border-[1px] shadow-md p-[2px] pl-[7px] pr-[7px]'>
                        <span className='text-[14px] font-Inter'>{mp.categoryName}</span>
                      </motion.button>
                    )
                  })}
                </div>
            </div>
            <div className='w-full flex flex-col gap-[10px] p-[15px] pt-[5px] pl-[0px] pr-[0px] h-full overflow-y-scroll'>
                <div className='w-full flex flex-1 flex-row gap-[5px]'>
                  {productlist.length > 0 ? (
                    <div className='w-full h-fit flex flex-row flex-wrap gap-[7px]'>
                      {categoryFilter === "All" ? (
                        productlist.map((mp: ProductDataInterface, i: number) => {
                          return(
                            <Productitem key={i} mp={mp} cartlist={cartlist} setcartlist={setcartlist} GetProductsListProcess={GetProductsListProcess} />
                          )
                        })
                      ) : (
                        productlist.filter((flt: ProductDataInterface) => flt.category === categoryFilter).map((mp: ProductDataInterface, i: number) => {
                          return(
                            <Productitem key={i} mp={mp} cartlist={cartlist} setcartlist={setcartlist} GetProductsListProcess={GetProductsListProcess} />
                          )
                        })
                      )}
                    </div>
                  ) : (
                    <Pageloader />
                  )}
                </div>
            </div>
        </div>
        {togglewidget === "cart" && (
          <div className='w-[450px] bg-shade p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Cart</span>
            <div className='shadow-lg border-[1px] w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit'>
                <div className='bg-shade p-[20px] flex flex-col gap-[7px] h-[400px] overflow-y-scroll'>
                  {cartlist.sort(function(a, b) {
                    return (a.pendingID - b.pendingID);
                  }).map((mp: CartItemInterface, i: number) => {
                    return(
                      <div key={i} title={mp.product.productName} className='w-full flex flex-row bg-white p-[10px] min-h-[90px] gap-[7px] shadow-md select-none'>
                        <img src={mp.product.previews[0]} className='h-full max-w-[80px]' />
                        <div className='flex flex-1 flex-col'>
                          <div className='w-full flex flex-row'>
                            <span className='text-[14px] font-semibold flex flex-1 marquee'>{mp.product.productName}</span>
                            <span className='text-[12px]'>&#8369; {mp.product.productPrice} x {mp.quantity}</span>
                          </div>
                          <div className='w-full flex flex-row flex-1'>
                            <span className='text-[12px] flex flex-1'>Total: &#8369; {mp.product.productPrice * mp.quantity}</span>
                          </div>
                          <div className='w-full flex flex-row justify-end gap-[5px]'>
                            <button onClick={() => { setcartlist((prev) => {
                              const prevfilter = prev.filter((flt: CartItemInterface) => flt.product.productID !== mp.product.productID);
                              const getcurrentinput = prev.filter((flt: CartItemInterface) => flt.product.productID === mp.product.productID);
                              const minusquantity = getcurrentinput.length > 0 ? getcurrentinput[0].quantity - 1 : 0
                              
                              if(minusquantity > 0){
                                return [...prevfilter, { pendingID: mp.pendingID, product: mp.product, quantity: minusquantity }]
                              }
                              else{
                                return prevfilter;
                              }
                            }) }} className='bg-orange-500 cursor-pointer flex flex-1 justify-center items-center h-[25px] shadow-sm text-white font-semibold rounded-[4px]'>
                              <span className='text-[12px]'>Minus</span>
                            </button>
                            <button onClick={() => { setcartlist((prev) => {
                              const prevfilter = prev.filter((flt: CartItemInterface) => flt.product.productID !== mp.product.productID);
                              
                              return prevfilter;
                            }) }} className='bg-red-500 cursor-pointer flex flex-1 justify-center items-center h-[25px] shadow-sm text-white font-semibold rounded-[4px]'>
                              <span className='text-[12px]'>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {authentication.user.permissions.includes("void_orders") && (
                  <div className='bg-shade p-[10px] flex flex-col gap-[5px]'>
                    <div className='w-full bg-white p-[10px] flex flex-col'>
                      <div className='w-full flex flex-row items-center'>
                        <span className='text-[14px] font-semibold w-full max-w-[80px]'>Void Order</span>
                        <div id='div_toggle_switch_container'>
                          <label className="switch">
                              <input type="checkbox" id='input_switch_server_create' checked={isOrderVoided} onChange={(e) => {
                                setisOrderVoided(e.target.checked)
                              }} />
                              <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                      <motion.div
                      initial={{
                        height: "0px"
                      }}
                      animate={{
                        height: isOrderVoided ? "auto": "0px"
                      }}
                      className='w-full flex flex-row overflow-y-hidden'>
                        <span className='text-[14px] font-semibold'>Previous Order ID: </span>
                        <input type='text' value={previousOrderID} onChange={(e) => { setpreviousOrderID(e.target.value) }} placeholder='Input Order ID to be voided' className='flex flex-1 h-[20px] pl-[5px] pr-[5px] text-[14px] outline-none' />
                      </motion.div>
                    </div>
                  </div>
                )}
                <div className='bg-shade p-[10px] flex flex-col gap-[5px]'>
                  <div className='w-full bg-white p-[10px] flex flex-col'>
                    <div className='w-full flex flex-row'>
                      <span className='text-[14px] font-semibold'>Table Number: </span>
                      <input type='number' value={tableNumber} onChange={(e) => { settableNumber(parseInt(e.target.value)) }} min={0} step={1} max={30} placeholder='Input amount received' className='flex flex-1 h-[20px] pl-[5px] pr-[5px] text-[14px] outline-none' />
                    </div>
                  </div>
                </div>
                <div className='bg-shade p-[10px] flex flex-col gap-[5px]'>
                  <div className='w-full bg-white p-[10px] flex flex-col'>
                    <span className='text-[14px] font-semibold'>Cart Total: &#8369; {cartTotalHolder}</span>
                    <div className='w-full flex flex-row'>
                      <span className='text-[14px] font-semibold'>Amount Received: &#8369; </span>
                      <input type='number' value={amountreceived} onChange={(e) => { setamountreceived(parseInt(e.target.value)) }} min={0.00} step={0.001} placeholder='Input amount received' className='flex flex-1 h-[20px] pl-[5px] pr-[5px] text-[14px] outline-none' />
                    </div>
                    <div className='w-full flex flex-row'>
                      <span className='text-[14px] font-semibold'>Discount: </span>
                      <input type='number' value={discount} onChange={(e) => { setdiscount(parseInt(e.target.value)) }} min={0} max={100} step={1} placeholder='Input discount percentage' className='flex flex-1 max-w-[65px] h-[20px] pl-[5px] pr-[5px] text-[14px] outline-none' />
                      <span className='text-[14px] font-semibold'>%</span>
                    </div>
                    <span className='text-[14px] font-semibold'>Change: &#8369; {amountreceived - (cartTotalHolder - (cartTotalHolder * (discount / 100)))}</span>
                  </div>
                </div>
                <div className='w-full h-fit flex flex-col gap-[5px] pt-[10px]'>
                  <button onClick={ConfirmOrder} className='h-[30px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Confirm</span>
                  </button>
                  <button onClick={() => {
                    // setcartlist([]);
                    // setamountreceived(0);
                    ClearCartFields();
                  }} className='h-[30px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Clear</span>
                  </button>
                </div>
            </div>
        </div>
        )}
        {togglewidget === "add_product" && authentication.user.permissions.includes("add_menu") && (
          <div className='w-[450px] bg-shade p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Add Product</span>
            <div className='shadow-lg border-[1px] w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit'>
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
                      {categorieslist.map((mp: CategoriesListInterface, i: number) => {
                        return(
                          <option key={i} value={mp.categoryName}>{mp.categoryName}</option>
                        )
                      })}
                    </select>
                  </div>
                </div>
                <div className='w-full h-fit flex flex-col gap-[5px] pt-[10px]'>
                  <button disabled={isSubmittingNewProduct} onClick={AddProductProcess} className='h-[30px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    {isSubmittingNewProduct ? (
                      <Buttonloader size='14px' />
                    ) : (
                      <span className='text-[14px]'>Add</span>
                    )}
                  </button>
                  <button onClick={ClearAddProductFields} className='h-[30px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Clear</span>
                  </button>
                </div>
            </div>
        </div>
        )}
        {togglewidget === "add_category" && authentication.user.permissions.includes("add_category") && (
          <div className='w-[450px] max-w-[450px] bg-shade p-[0px] flex flex-col pt-[20px] pb-[20px] pr-[10px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Add Category</span>
            <div className='shadow-lg border-[1px] w-full flex flex-col gap-[10px] bg-white p-[15px] pt-[20px] h-fit'>
                <div className='w-full flex flex-col gap-[5px]'>
                  <span className='text-[15px] font-semibold'>Category Name</span>
                  <input type='text' value={categoryName} onChange={(e) => { setcategoryName(e.target.value) }} placeholder='Input category name' className='w-full border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' />
                </div>
                <div className='w-full h-fit flex flex-col gap-[5px] pt-[10px]'>
                  <button disabled={isCategorySaving} onClick={AddCategoryProcess} className='h-[30px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    {isCategorySaving ? (
                      <Buttonloader size='14px' />
                    ) : (
                      <span className='text-[14px]'>Save Category</span>
                    )}
                  </button>
                  <button onClick={() => { setcategoryName(""); }} className='h-[30px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
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