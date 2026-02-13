import API from "./axiosInstance.js";

export const addProductToStore = (data)=>{
    return API.post("/api/groceryapp/store/shop/addproduct",data)
}

export const getProductByStore = ()=>{
    return API.get("/api/groceryapp/store/shop/getProductByStore")
}

export const deleteProductsByStore = (ids) => {
  return API.delete("/api/groceryapp/store/shop/delete/products", {
    data: { productIds: ids } 
  });
}

export const updateOutOfStockByStore = (ids)=>{
  return API.patch("/api/groceryapp/store/shop/products/updateoutofstock",
    {productIds : ids}
  );
}

export const applyDiscountToProducts = (ids,discountPercent)=>{
  return API.patch("/api/groceryapp/store/shop/products/applydiscount",
    {productIds : ids,discountPercent: discountPercent}
  );
}

export const updateProductDetailsOfStore = (id,data)=>{
  return API.patch("/api/groceryapp/store/shop/products/updateproduct",
    {productId:id,updatedProductDetails:data}
  );
}

export const deleteProductByStore = (id)=>{
  return API.delete("/api/groceryapp/store/shop/product/delete", {data: {productId:id}})
}
