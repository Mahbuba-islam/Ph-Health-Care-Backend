import {  Router } from "express";
import { userController } from "./user.controler";
import { validateRequest } from "../../middleware/validateRequest";
import { createAdminZodSchema, createDoctorZodSchema, createSuperAdminZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../../generated/prisma/enums";





const router = Router()
router.post("/create-doctor", validateRequest(createDoctorZodSchema), userController.createDoctor)
router.post("/create-admin", validateRequest(createAdminZodSchema), checkAuth(Role.SUPER_ADMIN), userController.createAdmin)
router.post("/create-super-admin", validateRequest(createSuperAdminZodSchema),
checkAuth(Role.ADMIN), userController.createSuperAdmin)
export const userRouter = router