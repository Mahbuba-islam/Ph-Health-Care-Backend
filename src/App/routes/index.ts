import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.router";
import { authRoutes } from "../modules/auth/auth.router";
import { userRouter } from "../modules/user/user.router";
import { doctorRouter } from "../modules/doctor/doctor.route";

const router = Router()

router.use("/specilities", specialityRouter)
router.use("/auth", authRoutes)
router.use("/users", userRouter)
router.use("/doctors", doctorRouter)
export const indexRoutes = router