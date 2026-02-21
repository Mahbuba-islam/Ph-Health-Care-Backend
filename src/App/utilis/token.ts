import { JwtPayload, SignOptions } from "jsonwebtoken";
import { Response } from "express";
import { jwtUtil } from "./jwt";
import { envVars } from "../../config/env";
import { cookieUtils } from "./cookie";

const getAccessToken = (payload:JwtPayload) => {
    const accessToken = jwtUtil.createToken(payload, envVars.ACCESS_TOKEN_SECRET, 
        {expiresIn: envVars.ACCESS_TOKEN_EXPIRY} as SignOptions)
    return accessToken;
}


const getRefreshToken = (payload:JwtPayload) => {
    const refreshToken = jwtUtil.createToken(payload, envVars.REFRESH_TOKEN_SECRET, 
        {expiresIn: envVars.REFRESH_TOKEN_EXPIRY} as SignOptions)
    return refreshToken;
}


const setAccessTokenInCookie = (res: Response, token: string) => {
    // const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRY as StringValue)
   cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60*60*60*24, // 1 day,
    path: "/"
   })
}


const refeshAccessTokenInCookie = (res: Response, token: string) => {
    // const maxAge = ms(envVars.REFRESH_TOKEN_EXPIRY as StringValue)
   cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60*60*60*24*7, // 7 day,
    path: "/"
   })
}




const setBetterAuthSessionCookie = (res: Response, token: string) => {
    // const maxAge = ms(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRY as StringValue)
   cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60*60*60*24, // 1 day,
   })
}


export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenInCookie,
    refeshAccessTokenInCookie,
    setBetterAuthSessionCookie
}

