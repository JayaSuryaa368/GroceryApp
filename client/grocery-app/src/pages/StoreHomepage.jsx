import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import { message, Result, Button, Input } from 'antd';
import { useState } from 'react';
import ListProducts from '../components/ListProducts';
import AddProduct from '../components/AddProduct';
import { addProductToStore , getProductByStore,deleteProductsByStore,updateOutOfStockByStore, applyDiscountToProducts} from '../api/products';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectionMode, resetSelectionMode, getProductOfStoreAsync } from '../redux/selectionSlice';

const StoreHomepage = () => {
  const dispatch = useDispatch();
  const {selectedIds,selectedOption,storeProducts}=useSelector((state)=>state.selection);

  const menus=["Products","Orders","Sales Analytics"];
  const [menu,setMenu]=useState("products");
  const [isAddButton,setIsAddButton]=useState(false)
  const [messageApi,contextHolder]=message.useMessage();
  // const [storeProducts,setStoreProducts]=useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [discountPercent,setdiscountPercent] = useState(0);

  const getProductByStores = async()=>{
    try{
      console.log("---from getproducts--tokecheck --- ",localStorage.getItem("token"))
      // const storeProductResponse= await getProductByStore();
      await dispatch(getProductOfStoreAsync());
      // console.log("thr stored product data is ",storeProductResponse.data.data)
      // if(storeProductResponse.data && storeProductResponse.data.success){
      //   setStoreProducts(storeProductResponse.data.data);
      // }
      // else{
      //   setStoreProducts([])
      // }
      // console.log(storeProductResponse.data)

    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    if(userData.isApproved === "approved"){
      console.log("running get prod use effect")
      getProductByStores();
    }
    
  },[])
  if(userData.isApproved === "pending"){
    return (
      <div>
      <NavBar menus={[]} defaultKey={[]} onMenuClick={()=>{}}/>
      <div className='bg-grey-800 text-white text-2xl'>
        <Result status="info" 
                title="Store Approval Pending" 
                subTitle="Our Admin Is Reviewing It,Please Check after 24 Hrs."
                extra={<div className="font-semibold text-white">Thank you for your patience!</div>}
        />
      </div>
      </div>
    )
  }

  if(userData.isApproved === "rejected"){
    return (
      <div>
      <NavBar menus={[]} defaultKey={[]} onMenuClick={()=>{}}/>
      <div className='bg-grey-800 flex justify-center items-center text-white text-2xl'>
        <Result status="error" 
                title="Approval Rejected" 
                subTitle="Your store does not align with our guidelines. Our team will contact you soon."
        />
      </div>
      </div>
    )
  }

  const handleMenuClick = (status)=>{
    setMenu(status)
  }

  const addProductsToStore = async(payload)=>{
          setLoading(true)
          try{
            
            console.log("products",payload);
            const addProductToStoreResponse= await addProductToStore(payload);
            if(addProductToStoreResponse.data.success){
              messageApi.success("Product added to your store",1).then(()=>setIsAddButton(false));
              getProductByStores();
            }
            else{
              console.log("the status is ",addProductToStore.data.status)
            }
          }
          catch(error){
            console.log(error)
            if(error.response){
              const {status}=error.response;
              if(status === 409){
                messageApi.info("Product is already added");
                setIsAddButton(false)
              }
              else{
                messageApi.error("Error Adding the product,please try after sometime")
              }
            }
           }
           finally{
            setLoading(false)
           }
      }

      const handleActionClick = (mode) => {
        if (selectedOption === mode && selectedIds.length > 0) {
          if (mode === "remove") deleteProductsFromStore(selectedIds);
          if (mode === "updateoutofstock") updateOutOfStockForProducts(selectedIds);
          if (mode === "applydiscount") applyDiscountForProducts(selectedIds);
          return;
        }

        dispatch(setSelectionMode(mode));
      };

      const deleteProductsFromStore = async(productIds)=>{
        try{
          const deleteResponse=await deleteProductsByStore(productIds);
          if(deleteResponse.data.success){
            messageApi.success(`Removed ${selectedIds.length} product from store`);
            dispatch(resetSelectionMode()); 
            getProductByStores();
          }
          else{
            messageApi.error("Products are not removed please try after a min")
          }
        }
        catch(error){
          messageApi.error("Internal server error.Try after sometime")
          console.log(error)
        }
      }

      const updateOutOfStockForProducts =async(ids)=>{
        try{
          const updateResponse=await updateOutOfStockByStore(ids);
          if(updateResponse.data.success){
            messageApi.success(`Update out of stock  for ${selectedIds.length}`)
            dispatch(resetSelectionMode()); 
            getProductByStores();
          }
          else{
            messageApi.error("Products are not removed please try after a min")
          }
        }
        catch(error){
          messageApi.error("Internal server error.Try after sometime")
          console.log(error.response)
        }
      }

      const applyDiscountForProducts = async()=>{
        try{
          const discountResponse= await applyDiscountToProducts(selectedIds,discountPercent);
          if(discountResponse.data.success){
            messageApi.success(`${discountPercent} % applied to ${selectedIds.length} products`)
            dispatch(resetSelectionMode()); 
            // getProductByStores();
            await dispatch(getProductOfStoreAsync());
            setdiscountPercent(0);
          }
          else{
            messageApi.error(`Discount not applied.Please try later`)
          }
        }
        catch(error){
          messageApi.error("Internal server error.Try after sometime")
          console.log(error.response)
        }
      }

  return (
    <div>
      {contextHolder}
      <NavBar menus={menus} defaultKey={menu} onMenuClick={handleMenuClick}/>
      <div className="text-2xl font-bold">
        <h3 >{userData.shopName.toUpperCase()}</h3>
        <div className='bg-gray-200 flex justify-start items-center m-2 p-2 space-x-2'>
        {menu === "products" && (
          <>
            <Button 
              type={isAddButton ? "default" : "primary"}
              onClick={() => setIsAddButton(!isAddButton)}
              className="hover:!scale-105" >
              Add Product
            </Button>
            <Button type="primary" danger onClick={()=>handleActionClick("remove")} className="hover:!scale-105">
              {selectedOption === "remove" && selectedIds.length > 0 ? `Remove ${selectedIds.length} products` : `Remove Products` }
            </Button>

            <Button type="default" className="hover:!scale-105" onClick={()=>handleActionClick("updateoutofstock")}>
              {selectedOption === "updateoutofstock" && selectedIds.length > 0 ? `Update Outof Stock for ${selectedIds.length}` : `Update Out of Stock`}
            </Button>

            <div className='flex flex-col'>
            <Button  className="!bg-[#f59e0b] !text-black hover:!scale-105" onClick={()=>handleActionClick("applydiscount")}>
              {selectedOption === "applydiscount" && selectedIds.length > 0 ? `Apply Discount for ${selectedIds.length}` :`Apply Discount`}
            </Button>  
            {selectedOption === "applydiscount" && selectedIds.length > 0 ? (
                <>
                <div className="flex items-center animate-fadeIn">
                <Input type="number" value={discountPercent}
                  className="w-12"
                  placeholder='Enter discount in roundoff'
                  prefix="%"
                  onChange={(e)=>setdiscountPercent(Number(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                ></Input> 
                </div>
                </>
              )
                : <></>
            }
            
            </div>
            <Button type="default">
              Sort By Brands
            </Button>
          </>
        )}
        </div>
        {
          isAddButton && <AddProduct loading={loading} disabled={loading} visible={isAddButton} addProductToStore={addProductsToStore} onCancel={()=> isAddButton ? setIsAddButton(false) : setIsAddButton(true)}/>
        }
      </div>
      <div>
        { menu === "products" && 
          <ListProducts storeProducts={storeProducts}/>}
      </div>
    </div>
   
  )
}

export default StoreHomepage