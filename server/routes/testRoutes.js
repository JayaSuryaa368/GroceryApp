import express from "express"
import { authMiddleware } from "../middlewares/authMiddlewares.js";
import { isUser } from "../middlewares/roleMiddlewares.js";

const router=express.Router();

router.get("/testtoken",authMiddleware,isUser,(req,res)=>{
    return res.status(200).send({
        success : true,
        message : "Token verified",
        data : req.user
    })
})

export default router;