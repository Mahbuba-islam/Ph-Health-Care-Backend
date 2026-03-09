import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.router";
import { authRoutes } from "../modules/auth/auth.router";
import { userRouter } from "../modules/user/user.router";
import { doctorRouter } from "../modules/doctor/doctor.route";
import { adminRouter } from "../modules/admin/admin.router";
import { superAdminRouter } from "../modules/superAdmin/superAdmin.router";
import { scheduleRoutes } from "../modules/schedules/schedules.router";
import { DoctorScheduleRoutes } from "../modules/doctorSchdules/doctorSchdules.router";
import { AppointmentRoutes } from "../modules/appointments/appointment.router";

const router = Router()

router.use("/specialities", specialityRouter)

router.use("/auth", authRoutes)
router.use("/users", userRouter)
router.use("/doctors", doctorRouter)
router.use("/admin", adminRouter)
router.use("/super-admin", superAdminRouter)
router.use("/schedules", scheduleRoutes)
router.use("/doctor-schedules", DoctorScheduleRoutes)
router.use("/appointments", AppointmentRoutes)


export const indexRoutes = router