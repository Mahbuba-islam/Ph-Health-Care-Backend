import { Router } from "express";
import { doctorController } from "./doctor.controler";
import { validateRequest } from "../../middleware/validateRequest";
import { updateDoctorValidationSchema } from "./doctor.validationSchema";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get("/", doctorController.getAllDoctors)
router.get("/:id", doctorController.getDoctorById)
router.put("/:id", validateRequest(updateDoctorValidationSchema), 
checkAuth(Role.ADMIN, Role.DOCTOR, Role.SUPER_ADMIN), doctorController.updateDoctor)

router.delete("/:id", checkAuth(Role.ADMIN, Role.DOCTOR, Role.SUPER_ADMIN), doctorController.deleteDoctor)
export const doctorRouter = router