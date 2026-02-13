import { login } from "../controllers/logincontroller.js";
import express from "express"

const router=express.Router();

router.post("/login",login);


export default router;