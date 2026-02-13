import user from "../models/user.js"
import store from "../models/store.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import admin from "../models/admin.js"

dotenv.config();

export const login = async(req,res)=>{
    try{
        const{email,password} = req.body;
        console.log("login api")
        if(!email || !password){
            return res.status(400).send({
                success:false,
                message : "Email and password are required"
            })
        }
        let account=await user.findOne({email});

        if(!account){
            account = await store.findOne({email});
        }

        if(!account){
            account = await admin.findOne({email});
        }

        if(!account){
            return res.status(404).send({
                success : false,
                message : "User not found"
            })
        }

        const passwordVerify= await bcrypt.compare(password,account.password);

        if(!passwordVerify){
            return res.status(401).send({
                success : false,
                message : "Password is wrong"
            })
        }

        const token=jwt.sign({id:account._id,role:account.role},process.env.JWT_SECRETKEY,{expiresIn:'1d'});

        return res.status(200).send({
            success:true,
            message:"Login Successfull!",
            token : token,
            role: account.role,
            user : {
                id : account._id,
                ...(account.role=== "store" && {isApproved:account.isApproved,shopName:account.shopName})
            }
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message : "Server Error"
        })
    }
}