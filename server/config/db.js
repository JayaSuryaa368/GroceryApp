import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
console.log("the DB url is "+process.env.MONGO_URL);

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected")
    }
    catch(error){
        console.log("Error in connecting to DB", error.message);
        process.exit(1);
    }
}

export default connectDB;