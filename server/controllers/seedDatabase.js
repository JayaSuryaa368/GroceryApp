import product from "../models/products.js"
import { getProductImage } from "../utils/productImages.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
console.log("the DB url is "+process.env.MONGO_URL);

const brands = ["ITC","Amul","Tata","HUL"];

const products = ["Egg","Salt","Tea","Corn Flour","Coffee","Groundnut Oil","Sunflower Oil"];

const price = [25,40,120,200,250,300,350]

const unit = ["piece","gram","gram","Kg","gram","litre","litre"]
const productSets = [];

await mongoose.connect(process.env.MONGO_URL);
console.log("Connected to MongoDB...");

brands.forEach((item)=>{
    products.forEach((product,index)=>{
        const imageUrl=getProductImage(item,product);
        productSets.push({
            storeId : "697633050487f8e8c1c53963",
            productName : product,
            brand : item,
            category : "Grains & Masalas",
            price : price[index],
            stockQuantity : Math.ceil(((index+1)*1203)/10),
            unit : unit[index],
            discount : 0,
            description : `Pure ${item} cow ${product}`,
            isDailyEssential : false,
            isAvailable : true,
            imageUrl : imageUrl,
        })
    })
})

console.log(productSets);

const seedDB = async()=>{
    try{
        const response = await product.insertMany(productSets);
        console.log(`Successfully seeded products!`);

        process.exit(0);
    }
    catch(error){
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}


seedDB();
