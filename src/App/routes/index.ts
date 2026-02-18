import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.router";
import { authRoutes } from "../modules/auth/auth.router";

const router = Router()

router.use("/specilities", specialityRouter)
router.use("/auth", authRoutes)
export const indexRoutes = router