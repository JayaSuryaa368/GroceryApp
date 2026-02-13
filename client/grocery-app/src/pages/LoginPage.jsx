import React, { useState } from 'react'
import {Button,Form,Input,message} from "antd"
import { useNavigate } from "react-router-dom";
import { login } from '../api/authApi';


const LoginPage = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const navigate =useNavigate();
    const[loading,setLoading]=useState(false)
    const onFinish = async (values)=>{
        try{
            setLoading(true)
            const payload={
                email : values.email,
                password : values.password
            }
            const response= await login(payload);

            if(response.data.success){
                console.log("---token---"+response.data.token)
                // localStorage.removeItem("token");
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                messageApi.success("Login Successful!",1.5).then(()=>{
                    const userRole=response.data.role;
                    if( userRole === "user"){
                        navigate("/userhomepage");
                    }
                    else if(userRole === "store"){
                        navigate("/storehomepage")
                    }
                    else{
                        navigate("/adminhomepage")
                    }
                    
                })
            }
        }
        catch(error){
            setLoading(false)
            if (error.response) {
                messageApi.error(error.response.data.message);
            } else {
                messageApi.error("Server error. Try again later.");
            }
        }
        }
  return (
    <>
    {contextHolder}
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-100 border-2 border-black-300 rounded-2xl">
        <div className="bg-blue-500 rounded-2xl">
            <div className='text-white'>Welcome To Grocery App</div>
            <div>Lets Login Now!</div>
        </div>
        <div className='max-w m-0.5 p-0.5'>
        <Form layout='vertical' className="text-left" onFinish={onFinish}>
            <Form.Item label="Email" name="email" rules={[{required:true,message:"Email is required"}]}>
                <Input placeholder='Enter your name'></Input>
            </Form.Item>
            <Form.Item label="Password" name="password" 
                rules={[{required:true,message:"Password is required"}]}>
                <Input.Password placeholder='Enter your name'></Input.Password>
            </Form.Item>
            <Form.Item>
                <div className='text-center'>
                <Button type='primary' htmlType='submit' loading={loading}> Login </Button>
                </div>
            </Form.Item>
        </Form>
        </div>
        <div className='bg-blue-500 rounded-2xl'>
            <p>New to Grocery App</p>
            <span className='text-center hover:underline text-white' 
                onClick={()=>navigate("/")}>Click to Register</span>
        </div>
    </div>
    </div>
    </>
  )
}

export default LoginPage