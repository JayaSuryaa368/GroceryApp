import { addProduct, getProductsByStore ,deleteProductsByStore, updateOutOfStockByStore, applyProductDiscount, 
    updateProductDetails, deleteProductByStore} from "../controllers/productController.js";
import express from "express"
import { authMiddleware } from "../middlewares/authMiddlewares.js";
import { isStore } from "../middlewares/roleMiddlewares.js";

const router=express.Router();

router.post("/store/shop/addproduct",authMiddleware,isStore,addProduct);

router.get("/store/shop/getProductByStore",authMiddleware,isStore,getProductsByStore);
// authMiddleware,isStore,

router.delete("/store/shop/delete/products",authMiddleware,isStore,deleteProductsByStore);


router.patch("/store/shop/products/updateoutofstock",authMiddleware,isStore,updateOutOfStockByStore);

router.patch("/store/shop/products/applydiscount",authMiddleware,isStore,applyProductDiscount);

router.patch("/store/shop/products/updateproduct",authMiddleware,isStore,updateProductDetails)

router.delete("/store/shop/product/delete",authMiddleware, isStore, deleteProductByStore);


export default router;