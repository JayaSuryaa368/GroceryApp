import admin from "../models/admin.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config();
const url=process.env.MONGO_URL;

const dbConnectionStatus= ()=>{mongoose.connect(url)};
dbConnectionStatus();
if(dbConnectionStatus){
        console.log("connected to db")
    }
export const createAdmin= async (req,res)=>{
    const adminExists = await admin.findOne({ email: "admin@gmail.com" });
    console.log("admin api")
    if (adminExists) {
        console.log("Admin already exists");
        process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await admin.create({
        name: "Super Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
    });

    console.log("Admin created");
    process.exit();
    };


createAdmin();