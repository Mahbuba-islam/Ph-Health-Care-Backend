import { Router } from "express";
import { specialityControler } from "./speciality.controler";

const router = Router()

router.post("/", specialityControler.createSpeciality)
router.get("/", specialityControler.getAllSpeciality)
router.delete("/:id", specialityControler.deleteSpeciality)
router.put("/:id", specialityControler.updateSpeciality)


export const specialityRouter = router