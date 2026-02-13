import axios from "axios"

const API=axios.create({
    baseURL:"http://localhost:5000",
})

API.interceptors.request.use(
    (config)=>{
        console.log(config)
        const token=localStorage.getItem("token");
        console.log("inside interceptors"+ token)
        if(token){
            console.log("adding the intercept token---")
            config.headers.Authorization=`Bearer ${token}`; 
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

export default API;