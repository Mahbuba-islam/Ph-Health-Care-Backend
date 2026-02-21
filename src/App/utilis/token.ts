import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtil } from "./jwt";
import { envVars } from "../../config/env";

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


export const tokenUtil = {
    getAccessToken,
    getRefreshToken
}