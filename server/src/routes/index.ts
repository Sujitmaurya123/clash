import {Router} from "express"
import AuthRoutes from "./authRoutes.js"
import VerifyRoutes from "./verifyRoutes.js"

const route=Router()

route.use("/api/auth",AuthRoutes);
route.use("/",VerifyRoutes);


export default route