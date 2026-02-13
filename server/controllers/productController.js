import product from "../models/products.js"
import { getProductImage } from "../utils/productImages.js";

export const addProduct = async(req,res)=>{
    try{
        console.log("---add product api")
        console.log(req.body)
        const isAvailable = req.body.isAvailable === 'false' ? false : Boolean(req.body.isAvailable);
        const isDailyEssential = req.body.isDailyEssential === 'false' ? false : Boolean(req.body.isDailyEssential);
        const {productName,brand,category,price,stockQuantity,unit,description}=req.body;

        if(!productName || !brand || !category || !price || !stockQuantity || !unit){
            return res.status(400).send({
                success : false,
                message : "Missing required details"
            })
        }
        console.log("---add product api_1")
        const existingProduct = await product.findOne({
            storeId: req.user.id,
            productName: { $regex: new RegExp(`^${productName}$`, 'i') }, // Case-insensitive check
            brand: { $regex: new RegExp(`^${brand}$`, 'i') }
        });
        console.log("---add product api_2")
        if(existingProduct){
            return res.status(409).send({
                success : false,
                message : "Product already added"
            })
        }
        console.log("---add product api_3")
        const imageUrl=getProductImage(brand,productName);
        console.log("---add product api_4",imageUrl)
        const productResponse = await product.create(
            {storeId:req.user.id,productName,brand,category,price,stockQuantity,unit,description,isDailyEssential,isAvailable,imageUrl}
        )
        console.log("---add product api_5")
        if(!productResponse){
            return res.status(404).send({
                success : false,
                message : "Unabel to add product"
            })
        }

        console.log("---add product api_6")
        return res.status(201).send({
            success : true,
            message : "Product is added"
        })
    }
    catch(error){
        console.log("---add product api_7")
        return res.status(500).send({
            success : false,
            message : "Server Error"
        })
    }
}

export const getProductsByStore = async(req,res)=>{
    try{
        console.log("----reached getproductbystore api ----")
        const storeId=req.user.id;
        // console.log("----storeid----",storeId);
        if(!storeId){
            return res.status(400).send({
                success : false,
                message : "Required Details Missing"
            })
        }

        const storeProductsResponse=await product.find({storeId:storeId});

        if(storeProductsResponse.length === 0){
            return res.status(200).send({
                success : true,
                message :"No products found",
                data: []
            })
        }

        return res.status(200).send({
            success : true,
            message : "Products found",
            data : storeProductsResponse,
        })
    }
    catch(error){
        return res.status(500).send({
            success : false,
            message : "Server Error"
        })
    }
}

export const deleteProductsByStore = async(req,res)=>{
    try{
        const {productIds}=req.body;
        console.log("the ids are---",req.body)
        const storeId=req.user.id;

        if(!productIds || !Array.isArray(productIds) || productIds.length === 0){
            return res.status(400).send({
                success : false,
                message : "product id are required"
            })
        }

        const deletedResult= await product.deleteMany({
            _id: {$in:productIds},
            storeId:storeId
        })

        if(deletedResult.deletedCount === 0){
            return res.status(404).send({
                success : false,
                message : "Products not found"
            })
        }

        return res.status(200).send({
            success : true,
            message :   `${deletedResult.deletedCount} products delted successfully `,
            deletedCount: deletedResult.deletedCount
        })
    }
    catch(error){
        console.error("Delete error:", error);
        res.status(500).json({
        success: false,
        message: "Server error during deletion"
        });
    }
}

export const updateOutOfStockByStore = async(req,res)=>{
    try{
        console.log("---",req.body)
        const { productIds } = req.body;
        
        const storeId = req.user.id;

        if(!productIds || !Array.isArray(productIds)){
            return res.status(400).send({
                success: false,
                message : "Require Product Ids missing"
            })
        }

        const updatedResult = await product.updateMany({
            _id: {$in : productIds},
            storeId : storeId,
            },
            {$set : {isAvailable : false}}
        )

        res.json({ 
        success: true, 
        message: `${updatedResult.modifiedCount} products updated`,
        modifiedCount: updatedResult.modifiedCount 
    });
    }
    catch(error){
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const applyProductDiscount = async(req,res)=>{
    try{
        console.log("--api disocunt 4")
        const {productIds,discountPercent}=req.body;
        const storeId = req.user.id;
        console.log("products id --- ",productIds)
        console.log("-- discount is---",discountPercent)
        console.log("-- discount is---",typeof(discountPercent))
        console.log("--api disocunt 3")
        if(!productIds || !Array.isArray(productIds) || productIds.length === 0){
            return res.status(400).send({
                success : false,
                message : "ids required"
            })
        }
        console.log("--api disocunt 1")
        const applyDisocuntResult= await product.updateMany(
            {
                _id : {$in : productIds},
                storeId : storeId,
            },
            {
                $set : {discount : Number(discountPercent)}
            }
        )
        console.log("--api disocunt 1")
        return res.status(200).send({
            success : true,
            message : "product discount updated",
            data : `Discount applied to ${applyDisocuntResult.modifiedCount}`
        })
    }
    catch(error){
        return res.status(500).send({
            success : false,
            message : "Server Error"
        })
    }
}

export const updateProductDetails = async(req,res)=>{
    try{
        const {productId,updatedProductDetails} = req.body;
        const storeID=req.user.id;
        console.log("product id is --- ",productId)
        console.log("----reached update product api-----",updatedProductDetails)
        console.log("----reached update product store-----",storeID)
        const booleanFields = ['isAvailable','isDailyEssential'];
        console.log("----reached update product api 1-----")
        booleanFields.forEach(field => {
            if(updatedProductDetails[field]!== undefined){
                const value = String(updatedProductDetails[field]).toLowerCase();
                updatedProductDetails[field] = (value === 'true');
            }
        });
        console.log("----reached update product api 2 -----")
        console.log("----reached update product api 3  -----")
        const updateResult = await product.findByIdAndUpdate(
            { 
                _id: productId, 
                storeId: storeID
            },
            { $set: updatedProductDetails },
            { 
                new: true, 
                runValidators: true,
                select: '-__v'
            }
        )
        console.log("----reached update product api 4 -----")
        if (!updateResult) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        console.log("----reached update product api 5-----")
        return res.status(200).json({
                    success: true,
                    message: "Product updated successfully",
                    data: updateResult
                });
    }
    catch(error){
        console.log(error.message)
        res.status(500).send({
            success : false,
            message : "Server Error",
            
        })
    }
}

export const deleteProductByStore = async(req,res)=>{
    try{
        console.log("in delete api 1")
        const storeId = req.user.id;
        console.log("in delete api 2",storeId)
        const {productId} = req.body;
        console.log("the delte p id is --",productId)
        
        if(!productId){
            return res.status(400).send({
                success : false,
                message : "Invalid Producrt"
            })
        }
        console.log("in delete api 3")
        const deletedProduct = await product.findOneAndDelete({
            _id: productId,
            storeId : storeId
        });
        console.log("in delete api 1")
        if(!deletedProduct){
            return res.status(404).send({
                success : false,
                message : "product nort found"
            })
        }
        console.log("in delete api 1")
        return res.status(200).send({
            success : true,
            message : "Product deleted"
        })
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Server Error"
        })
    }
}