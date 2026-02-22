import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controler";
import { updateAdminValidationSchema } from "./admin.validation";

const router = Router()

router.get("/", adminController.getAllAdmin)
router.get("/:id", adminController.getAdminById)
router.put("/:id", validateRequest(updateAdminValidationSchema), 
checkAuth(Role.ADMIN, Role.DOCTOR, Role.SUPER_ADMIN), adminController.updateAdmin)

router.delete("/:id", checkAuth(Role.ADMIN, Role.DOCTOR, Role.SUPER_ADMIN), adminController.deleteAdmin)
export const adminRouter = router