import { Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponsr";
import status from "http-status";

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


export const userController = {
    createDoctor
}

