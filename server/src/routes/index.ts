import {Router} from "express"
import AuthRoutes from "./authRoutes.js"
import VerifyRoutes from "./verifyRoutes.js"
import ClashRoutes from "./clashRoutes.js"

const route=Router()

route.use("/api/auth",AuthRoutes);
route.use("/",VerifyRoutes);
route.use("/api/clash",ClashRoutes);

export default route