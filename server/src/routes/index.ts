import {Router} from "express"
import AuthRoutes from "./authRoutes.js"
import VerifyRoutes from "./verifyRoutes.js"
import ClashRoutes from "./clashRoutes.js"
import authMiddleware from "../middleware/AuthMiddleware.js"
const route=Router()

route.use("/api/auth",AuthRoutes);
route.use("/",VerifyRoutes);
route.use("/api/clash",authMiddleware,ClashRoutes);

export default route