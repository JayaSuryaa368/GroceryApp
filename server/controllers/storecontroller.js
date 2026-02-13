import store from "../models/store.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config();

export const registerStore = async (req,res)=>{
    try{
        const {shopName,ownerName,email,phoneNumber,password,gstNumber,address,pincode} = req.body;
        console.log("register api")
        if(!shopName || !ownerName || !email || !phoneNumber || !password || !gstNumber || !address || !pincode){
            return res.status(400).send({
                success : false,
                message : "Reuired fields are missing"
            })
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const registerStoreRespone= await store.create({
            shopName,ownerName,email,phoneNumber,password: hashedPassword,gstNumber,address,pincode
        });

        console.log("---registering the store response---"+registerStoreRespone)
        return res.status(201).send({
            success : true,
            message : "Store registered. Waiting for admin approval.",
            data : registerStoreRespone,
        })
    }
    catch(error){
        console.log(error); 
          if (error.code === 11000) {
            return res.status(400).send({
                success: false,
                message: "Shopname or Email already exists",
            });
            }
        res.status(500).send({
            success : false,
            message : "Internal server error"
        })
    }
}

export const storeLogin = async(req,res)=>{
    try{
            const {email,password} = req.body;
            console.log("register api")
            if(!email || email == ""){
                return res.status(400).send({
                    success : false,
                    message : "Emailid is required"
                })
            }
    
            if(!password || password == ""){
                return res.status(400).send({
                    success : false,
                    message : "Password is required"
                })
            }
            const userExist = await store.findOne({email});

             if(!userExist){
                return res.status(400).send({
                    success : false,
                    message : "Emailid not found"
                })
            }

            const isMatch = await bcrypt.compare(password,userExist.password);
            console.log("checking the password")
            console.log(isMatch)
            if(isMatch){
                const jwttoken=jwt.sign(
                    {id:userExist._id,role : userExist.role},
                    process.env.JWT_SECRETKEY,
                    {expiresIn : '1d'}
                )

                return res.status(200).send({
                    success : true,
                    message : "logged in successfully",
                    token : jwttoken,
                    data : {storeName : userExist.storeName,role:userExist.role,isApproved: userExist.isApproved}
                })
            }
            
            return res.status(401).send({
                success : false,
                message  : "Emailid or Password is wrong"
            })
        }
        catch(error){
           return res.status(400).send({
                success : false,
                message  : "Emailid or Password is wrong"
            })
        }
}

export const getStoresByAprrovedStatus = async(req,res)=>{
    try{
        const { storeStatus }=req.query;
        console.log("reaching get stores ",storeStatus);
        const storesByRequestedAprrovedStatus= await store.find({isApproved:storeStatus});
        if(storesByRequestedAprrovedStatus.length === 0){
            return res.status(404).send({
                success : false,
                message : "No stores found for your request"
            })
        }
        const requiredData = storesByRequestedAprrovedStatus.map( store => {
            return {
                id : store._id,
                shopName : store.shopName,
                ownerName : store.ownerName,
                email : store.email,
                phoneNumber : store.phoneNumber,
                gstNumber : store.gstNumber,
                address : store.address,
                pincode : store.pincode,
            }
        })
        return res.status(200).send({
            success:true,
            data : requiredData,
        })
    }
    catch(error){
        return res.status(500).send({
            success : false,
            message : "Server error"
        })
    }
}

export const updateStoreStatus = async(req,res)=>{
    try{
        const {id,status}=req.body;
        console.log("-------in updating the store status---",id,status)
        if (!id || !status) {
            return res.status(400).send({
                success: false,
                message: "Store ID and status are required"
            });
        }

        const updatedStatus = await store.findByIdAndUpdate(id,{isApproved : status},{new:true}).select("-password");
        if(updatedStatus){
            return res.status(200).send({
                success : true,
                message : "updated the store",
                data : {shopName:updatedStatus.shopName},
            })
        }
        return res.status(400).send({
            success : false,
            message : "Store not updated"
        })
    }
    catch(error){
        return res.status(500).send({
            success : false,
            message : "Internal serve error"
        })
    }
}