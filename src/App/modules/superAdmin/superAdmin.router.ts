import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../../generated/prisma/enums";


import { superAdminController } from "./superAdmin.controler";
import { updateSuperAdminValidationSchema } from "./superAdmin.validation";

const router = Router()

router.get("/", superAdminController.getAllSuperAdmin)
router.get("/:id", superAdminController.getSuperAdminById)
router.put("/:id", validateRequest(updateSuperAdminValidationSchema), 
checkAuth(Role.ADMIN, Role.DOCTOR, Role.SUPER_ADMIN), superAdminController.updateSuperAdmin)

router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), superAdminController.deleteSuperAdmin)
export const superAdminRouter = router