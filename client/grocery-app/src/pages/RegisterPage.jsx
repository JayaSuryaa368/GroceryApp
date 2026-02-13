import React, { useState } from 'react'
import { Button, Form, Input, message, Radio,InputNumber } from 'antd';
import { Link } from "react-router-dom";
import { registerStore, registerUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();
    const [userType,setUserType] =useState("user")
    const setType = (e)=>{
        setUserType(e.target.value)
    }
    const onFinish = async (values)=>{
        try{
            setLoading(true);
            const payload={
                ...(userType == "user" && {
                    name : values.name,
                }),
                ...(userType == "store" && {
                    shopName : values.shopname,
                    ownerName : values.ownername,
                }),
                email : values.email,
                phoneNumber : values.phonenumber,
                password : values.password,
                ...(userType == "store" && {
                    gstNumber : values.gstnumber,
                }),
                address : values.address,
                pincode : values.pincode
            }
            const response = await (userType === "user" ? registerUser(payload) : registerStore(payload));
            console.log(response)
            if(response.data.success){
                messageApi.success("Registered Successfully!", 1.5).then(() => {
                navigate("/login"); 
            });
            }
            else{
                setLoading(false);
                if(response.data.status == 400){
                    messageApi.error("Details provided already have a account");
                }
                else{
                    messageApi.error("Registeration failed,Try after a mins");
                }
            }
        }
        catch(error){
            setLoading(false)
            if (error.response) {
                if (error.response.status === 400) {
                    messageApi.error("Details provided already have an account");
                } else {
                    messageApi.error(`Server Error: ${error.response.data.message || "Registration failed"}`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                messageApi.error("No response from server. Check your connection.");
            } else {
                // Something happened in setting up the request
                messageApi.error("An unexpected error occurred.");
            }
        }
        finally{
            setLoading(false)
        }
    }
  return (
    <>
    {contextHolder}
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-100 border-2 border-black-300 rounded-2xl">
          
        <div className="bg-blue-500 rounded-2xl">
        <div>New To Grocery App</div>
        <div>Register Now!</div>
        </div>
        <div className='max-w m-0.5 p-0.5'>
            <div className="flex space-evenly my-4">
                <span className='mr-5'>Register as : </span>
                <Radio.Group className='mr-5' value={userType} onChange={setType} options={[{value:"user" ,label:"User"},{value:"store", label:"Store"}]}>
                </Radio.Group>
            </div>
            <Form layout="vertical" className="text-left" onFinish={onFinish}>
                { userType=== "user" && <Form.Item label="Name" name="name" rules={[{required: true,message:"Please input your name"}]}>
                    <Input placeholder='Enter your name'></Input>
                </Form.Item>}
                { userType=== "store" && <Form.Item label="Shop Name" name="shopname" rules={[{required: true,message:"Please input your name"}]}>
                    <Input placeholder='Enter your shop name'></Input>
                </Form.Item>}
                { userType=== "store" && <Form.Item label="Owner Name" name="ownername" rules={[{required: true,message:"Please input your name"}]}>
                    <Input placeholder="Enter shop owner's name"></Input>
                </Form.Item>}
                <Form.Item label="Email" name="email" rules={[{required: true,message:"Email is required!"}]}>
                    <Input placeholder='Enter your email'></Input>
                </Form.Item>
                <Form.Item label ="Phonenumber" name="phonenumber" rules={[{required: true,message:"Phonenumber is required!"}]}>
                    <Input placeholder='Enter your phonenumber'></Input>
                </Form.Item>
                { userType=== "store" && <Form.Item label="GST Number" name="gstnumber" rules={[{required: true,message:"Please input your name"}]}>
                    <Input placeholder='Enter your shop GST Number'></Input>
                </Form.Item>}
                <Form.Item label="Address" name="address" rules={[{required:true,message:"Address is required"}]}>
                    <Input placeholder='Enter your address'></Input>
                </Form.Item>
               <Form.Item
                label="Pincode"
                name="pincode"
                rules={[
                    { required: true, message: "Pincode is required" },
                    { pattern: /^[0-9]{6}$/, message: "Pincode must be exactly 6 digits" }
                ]}
                    getValueFromEvent={(e) =>
                        e.target.value.replace(/\D/g, '').slice(0, 6)
                    }
                >
                <Input
                    placeholder="Enter your pincode"
                    maxLength={6}
                    inputMode="numeric"
                />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{required: true,message:"Password is required"}]}>
                    <Input.Password placeholder='Enter your password'></Input.Password>
                </Form.Item>
                <Form.Item label="Confirm Password" name="confirmpassword" dependencies={['password']}
                    rules={[{required: true,
                        message:"Reenter your password required"},
                        ({getFieldValue})=>({
                            validator(_,value){
                                if(!value|| getFieldValue('password') === value){
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match"))
                            }
                        })
                        ]}>
                    <Input.Password placeholder='ReEnter your password'></Input.Password>
                </Form.Item>
               
                <Form.Item>
                    <div className='text-center'>
                        <Button type="primary" htmlType='submit' loading={loading}>
                            Register
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
        <div>
            <p>
                Already a user?
                <Link to="/login" 
                    className="text-blue-600 hover:underline font-medium ml-1">Login
                </Link>
            </p>
        </div>
        
    </div>
    </div>
    </>
  )
}

export default RegisterPage;