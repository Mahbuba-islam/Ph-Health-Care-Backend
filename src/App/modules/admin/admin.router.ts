import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/cheackAuth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controler";
import { updateAdminValidationSchema } from "./admin.validation";

const router = Router()

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAllAdmin)
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAdminById)
router.put("/:id", checkAuth(Role.SUPER_ADMIN),  validateRequest(updateAdminValidationSchema), 
checkAuth(Role.SUPER_ADMIN), adminController.updateAdmin)

router.delete("/:id", checkAuth(Role.SUPER_ADMIN), adminController.deleteAdmin)
export const adminRouter = router