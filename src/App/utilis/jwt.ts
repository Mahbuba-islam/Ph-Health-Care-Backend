/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload,  SignOptions } from "jsonwebtoken"


const createToken = (payload:JwtPayload, secret:string, {expiresIn}: SignOptions)=> {
    const token = jwt.sign(payload, secret, {
        expiresIn
    })
    return token
     
}

const verifyToken = (token:string, secret:string) => {
    
   try{
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return {
        success: true,
        data: decoded
    }
   }
   catch(err: any){
    return{
     success: false,
   message: err.message
   
    }
  
   }
    
}

const decodeToken = (token:string) => {
   const decoded = jwt.decode(token, {complete: true}) as any
   return decoded
}


export const jwtUtil = {
    createToken,
    verifyToken,
    decodeToken
}