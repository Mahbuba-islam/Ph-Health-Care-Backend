import { Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponsr";
import status from "http-status";



//create doctor controler

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const doctorData = req.body
    const result = await userService.createDoctor(doctorData)
   sendResponse(res, {
    success: true,
    httpStatusCode:status.CREATED,
    message: "Doctor created successfully",
    data: result
   })
})





//create admin controler

const createAdmin = catchAsync(async(req: Request, res: Response) => {
    const payload = req.body
    const result = await userService.createAdmin(payload)
   sendResponse(res, {
    success: true,
    httpStatusCode:status.CREATED,
    message: "Admin created successfully",
    data: result
   })
})




//create super admin controler

const createSuperAdmin = catchAsync(async(req: Request, res: Response) => {
    const payload = req.body
    const result = await userService.createSuperAdmin(payload)
   sendResponse(res, {
    success: true,
    httpStatusCode:status.CREATED,
    message: "Super Admin created successfully",
    data: result
   })
})

export const userController = {
    createDoctor,
    createAdmin,
    createSuperAdmin
}

