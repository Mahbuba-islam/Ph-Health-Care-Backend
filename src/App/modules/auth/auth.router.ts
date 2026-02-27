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

router.post("/logOut", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.PATIENT, Role.DOCTOR), authControler.logOutUser)
export const authRoutes = router

router.post("/verify-email", authControler.verifyEmail)
router.post("/forget-password", authControler.forgetPassword)
router.post("/reset-password", authControler.resetPassword)

router.get("/login/google", authControler.googleLogin)
router.get("/google/success", authControler.googleLoginSuccess)
router.get("/oauth/error", authControler.handleOauthError)