import { Router } from "express";
import { authControler } from "./auth.controler";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/register", authControler.registeredPatient)
router.post("/login", authControler.loginUser)
router.get("/me", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.PATIENT, Role.DOCTOR), authControler.getMe)
router.post("/refresh-token", authControler.getNewToken)
router.post('/change-password', 
    checkAuth(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN),
authControler.changePassword)
export const authRoutes = router

