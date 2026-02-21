import { Router } from "express";
import { doctorController } from "./doctor.controler";

const router = Router()

router.get("/", doctorController.getAllDoctors)
router.get("/:id", doctorController.getDoctorById)
router.put("/:id", doctorController.updateDoctor)
router.delete("/:id", doctorController.deleteDoctor)
export const doctorRouter = router