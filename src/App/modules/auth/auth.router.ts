import { Router } from "express";
import { authControler } from "./auth.controler";

const router = Router()

router.post("/register", authControler.registeredPatient)
router.post("/login", authControler.loginUser)
router.get("/me", authControler.getMe)
export const authRoutes = router