import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponsr";
import status from "http-status";
import { tokenUtils } from "../../utilis/token";

const registeredPatient = catchAsync(
    async(req:Request, res:Response)=>{
        const payload = req.body
        console.log(payload);
        const result = await authService.registeredPatient(payload)
        sendResponse(res, {
            httpStatusCode:status.CREATED,
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
        const {accessToken, refreshToken, token, ...rest} = result
        tokenUtils.setAccessTokenInCookie(res, accessToken)
        tokenUtils.refeshAccessTokenInCookie(res, refreshToken)
        tokenUtils.setBetterAuthSessionCookie(res, token)
        
      sendResponse(res, {
        httpStatusCode:status.OK,
        success:true,
        message:"Patient login successfully",
        data:{
            accessToken,
            refreshToken,
            ...rest
        }
      })
    }
)

export const authControler = {
    registeredPatient,
    loginUser
}