import express from "express"

import { createUser, userLogin } from "../controllers/usercontroller.js";

const router=express.Router();

router.post("/registeruser",createUser);

router.post("/loginuser",userLogin);

export default router;