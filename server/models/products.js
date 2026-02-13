import mongoose from "mongoose"

const productSchema= new mongoose.Schema({
    storeId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "store",
        required : true
    },
    productName : {
        type : String,
        required: true,
        trim : true
    },
    brand: { 
        type: String, 
        required: [true, 'Brand name is required'],
        trim : true
    },
    category : {
        type : String,
        required : true,
        enum : ["Milk & Diary","Vegetable & Fruits","Grains & Masalas","Snacks","Household"]
    },
    price  : {
        type : Number,
        required : true,
        min : [0,"price cannot be negatieve"]
    },
    stockQuantity : {
        type : Number,
        required : true,
        default : 0
    },
    unit : {
        type : String,
        required : true,
        enum : ["Kg","gram","ml","litre","piece"]
    },
    discount :{
        type : Number,
        default : 0,
        min : [0,"Disocunt cant be negative"],
        max : [100, "Discount cant exceed 100"]
    },
    description : {
        type : String,
        trim : true
    },
    isDailyEssential : {
        type : Boolean,
        default : false
    },
    isAvailable : {
        type : Boolean,
        default : true
    },
    imageUrl : {
        type : String,
        default : ""
    }
    },
    {
        timestamps : true
    }
);

productSchema.index({productName : "text",brand : "text",category : "text"})

export default mongoose.model("product",productSchema);