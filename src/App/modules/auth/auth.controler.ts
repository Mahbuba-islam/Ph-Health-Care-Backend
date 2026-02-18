import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponsr";

const registeredPatient = catchAsync(
    async(req:Request, res:Response)=>{
        const payload = req.body
        console.log(payload);
        const result = await authService.registeredPatient(payload)
        sendResponse(res, {
            httpStatusCode:201,
            success:true,
            message:"Patient registered successfully",
            data:result
        })
    }
)


const loginUser = catchAsync(
    async(req:Request, res:Response)=>{
        const payload = req.body;
        const result = await authService.loginUser(payload)
      sendResponse(res, {
        httpStatusCode:201,
        success:true,
        message:"Patient login successfully",
        data:result
      })
    }
)

export const authControler = {
    registeredPatient,
    loginUser
}