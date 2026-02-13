import user from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();
export const createUser = async (req,res)=>{
    try{
        console.log("reched register api")
        const {name,email,phoneNumber,password,address,pincode}=req.body;
        

        if(!name || !email || !phoneNumber || !password || !address || !pincode){
            return res.status(400).send({
                success : false,
                message : "Required fields Name,Email,Phonenumber,Password,Address any one of them is missing"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userDetails = await user.create({name,email,phoneNumber,password: hashedPassword,address,pincode});
        console.log("---userCreate---"+userDetails)
       
        return res.status(201).send({
            success : true,
            message : "user is registered succesfully",
            data : userDetails,
        })
    }
    catch(error){
        console.log(error); 
          if (error.code === 11000) {
            return res.status(400).send({
                success: false,
                message: "Provided details already exists",
            });
            }
        res.status(500).send({
            success : false,
            message : "Internal server error"
        })
    }
}

export const userLogin = async (req,res)=>{
    try{
        const {email,password} = req.body;
        console.log("user login api")
        if(!email || email == ""){
            return res.status(401).send({
                success : false,
                message : "Emailid is required"
            })
        }

        if(!password || password == ""){
            return res.status(401).send({
                success : false,
                message : "Password is required"
            })
        }

        const userExist = await user.findOne({email});
        
        if(!userExist){
            return res.status(401).send({
                success : false,
                message : "Email not registered"
            })
        }

        const isMatch = await bcrypt.compare(password,userExist.password);

        if(!isMatch){
            return res.status(400).send({
                success : true,
                message : "Password is incorrect"
            })
        }
        
        const secretKey=process.env.JWT_SECRETKEY;
        console.log("---the role is "+userExist.role)
        const token=jwt.sign(
            {id:userExist._id,role:userExist.role},
            secretKey,
            {expiresIn : '1d'}
        )
        
        return res.status(200).send({
            success: true,
            message : "loggedin successfully",
            token : token,
            data : {userName : userExist.name,role : userExist.role}
        })
    }
    catch(error){
       return res.status(400).send({
            success : false,
            message  : "Emailid or Password is wrong"
        })
    }
}