import { Router } from "express";
import AuthRoutes from "./authRoutes.js";
const route = Router();
route.use("/api/auth", AuthRoutes);
export default route;
