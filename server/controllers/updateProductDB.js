import product from "../models/products.js"
import mongoose from "mongoose";
import connectDB from "../config/db.js"

const updateExistingProductWithDiscount = async()=>{
    try{
        const result= await product.updateMany(
            {disount : {$exists : false}},
            {$set : {discount : 0}}
        )
        console.log(`${result.modifiedCount} products updated with default value`);
        mongoose.connection.close();
    }
    catch(error){
        console.log(error.message)
    }
}
connectDB();

updateExistingProductWithDiscount();