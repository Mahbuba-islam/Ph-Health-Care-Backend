import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../../shared/sendResponsr";
import status from "http-status";
import { tokenUtils } from "../../utilis/token";
import AppError from "../../errorHelpers/AppError";

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
        message:" login successfully",
        data:{
            accessToken,
            refreshToken,
            ...rest
        }
      })
    }
)



// get me
const getMe = catchAsync(
    async(req:Request, res:Response)=>{
        const user = req.user;
        const result = await authService.getMe(user)
       
      sendResponse(res, {
        httpStatusCode:status.OK,
        success:true,
        message:"user profile fetched successfully",
        data: result
      })
    }
)


//get new token
const getNewToken = catchAsync(async(req:Request, res:Response)=>{
    const refreshToken = req.cookies.refreshToken
    const betterAuthSessionToken = req.cookies["better-auth.session_token"]

    if(!refreshToken){
        throw new AppError(status.UNAUTHORIZED, "refresh token is missing")
    }
    const results = await authService.getNewToken(refreshToken, betterAuthSessionToken)
    const {accessToken, refreshToken:newRefreshToken, sessionToken} = results

    tokenUtils.setAccessTokenInCookie(res, accessToken)
    tokenUtils.refeshAccessTokenInCookie (res, newRefreshToken)
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken)

    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"new tokens successfully",
        data:{
            accessToken,
            refreshToken:newRefreshToken,
            sessionToken,

        }
    })
})




//change password
const changePassword = catchAsync(async(req:Request, res:Response)=> {
    const payload = req.body
    const betterAuthSessionToken = req.cookies["better-auth.session_token"]
    const result = await authService.changePassword(payload, betterAuthSessionToken)
    const {accessToken, refreshToken, token} = result

      tokenUtils.setAccessTokenInCookie(res, accessToken)
    tokenUtils.refeshAccessTokenInCookie (res, refreshToken)
    tokenUtils.setBetterAuthSessionCookie(res, token as string)

  sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"password changed successfully",
        data:result
    })

})


export const authControler = {
    registeredPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword
}