import {  Router } from "express";
import { userController } from "./user.controler";
import { validateRequest } from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validation";





const router = Router()
router.post("/create-doctor", validateRequest(createDoctorZodSchema), userController.createDoctor)
export const userRouter = router