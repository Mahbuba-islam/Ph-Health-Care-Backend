import { Router } from "express";
import { specialityControler } from "./speciality.controler";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";

const router = Router()

router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.single("file"), specialityControler.createSpeciality)
router.get("/", specialityControler.getAllSpeciality)
router.delete("/:id", specialityControler.deleteSpeciality)
router.put("/:id", specialityControler.updateSpeciality)


export const specialityRouter = router