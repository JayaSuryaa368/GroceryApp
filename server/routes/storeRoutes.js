import express from "express"
import { registerStore , storeLogin, getStoresByAprrovedStatus,updateStoreStatus} from "../controllers/storecontroller.js";
import { authMiddleware } from "../middlewares/authMiddlewares.js";
import { isUser,isAdmin,isStore } from "../middlewares/roleMiddlewares.js";

const router=express.Router();

router.post("/registerstore",registerStore);

router.post("/loginstore",storeLogin);

router.get("/store/status",authMiddleware,isAdmin,getStoresByAprrovedStatus);

router.patch("/store/update/storestatus",authMiddleware,isAdmin,updateStoreStatus);

export default router;