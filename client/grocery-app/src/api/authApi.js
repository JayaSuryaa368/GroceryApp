import API from "./axiosInstance.js"

export const registerUser = (data) => {
    console.log(API.defaults.baseURL);
  return API.post("/api/groceryapp/registeruser", data);
}; 

export const registerStore = (data)=>{
    return API.post("/api/groceryapp/registerstore",data);
}


export const login = (data) =>{
    return API.post("/api/groceryapp/login",data);
}



export const getStoreByStatus = (data)=>{
    return API.get("/api/groceryapp/store/status",{params:data});
}

export const updateStoreByStatus = (data)=>{
    return API.patch("/api/groceryapp/store/update/storestatus",data);
}


