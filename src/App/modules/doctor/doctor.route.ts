import { Router } from "express";
import { doctorController } from "./doctor.controler";
import { validateRequest } from "../../middleware/validateRequest";
import { updateDoctorValidationSchema } from "./doctor.validationSchema";

const router = Router()

router.get("/", doctorController.getAllDoctors)
router.get("/:id", doctorController.getDoctorById)
router.put("/:id", validateRequest(updateDoctorValidationSchema), doctorController.updateDoctor)
router.delete("/:id", doctorController.deleteDoctor)
export const doctorRouter = router