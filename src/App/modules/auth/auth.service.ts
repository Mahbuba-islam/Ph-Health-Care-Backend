import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { tokenUtils } from "../../utilis/token";

interface IRegisteredPatientPayload {
    name:string;
    email:string;
    password:string
    deletedAt:Date
}


interface ILoginUserPayload{
    email:string
    password:string
}


const registeredPatient = async(payload:IRegisteredPatientPayload)=>{
 const {name, email, password} = payload
 const data = await auth.api.signUpEmail({
    body:{
      name,
      email,
      password,
    
    }

 })



 if(!data.user){
 throw new AppError(status.BAD_REQUEST, "Failed to register patient")
 }



  //create patient profile with transaction
const patient = await prisma.$transaction(async (tx) => {
    try{
   const patientProfile =    await tx.patient.create({
        data:{
            userId:data.user.id,
            name:payload.name,
            email:payload.email
        }
    })

    return patientProfile
    }
    catch(err){
     console.log("trascaction error", err);
     await prisma.user.delete({
        where:{
            id:data.user.id
        }
     })
     throw err
    }
 
})


const accessToken = tokenUtils.getAccessToken({
        userId:data.user.id,
        email:data.user.email,
        name:data.user.name,
        role:data.user.role,
        status:data.user.status,
        isDeleted:data.user.isDeleted,
        emailVerified:data.user.emailVerified
    })

    const refreshToken = tokenUtils.getRefreshToken({
        userId:data.user.id,
        email:data.user.email,
        name:data.user.name,
        role:data.user.role,
        status:data.user.status,
        isDeleted:data.user.isDeleted,
        emailVerified:data.user.emailVerified
    })

 return {
    ...data,
    accessToken,
    refreshToken,
    patient
 }
}




//login//

const loginUser = async(payload:ILoginUserPayload)=>{
    const {email, password} = payload
    const data = await auth.api.signInEmail({
         body :{
            email,
            password
        }
       
    })
    if(data.user.status === UserStatus.BLOCKED){
        throw new AppError(status.FORBIDDEN, "User is Blocked")
    }
    if(data.user.isDeleted || data.user.status=== UserStatus.DELETED){
        throw new AppError(status.FORBIDDEN, "User is deleted")
    }

    const accessToken = tokenUtils.getAccessToken({
        userId:data.user.id,
        email:data.user.email,
        name:data.user.name,
        role:data.user.role,
        status:data.user.status,
        isDeleted:data.user.isDeleted,
        emailVerified:data.user.emailVerified
    })

    const refreshToken = tokenUtils.getRefreshToken({
        userId:data.user.id,
        email:data.user.email,
        name:data.user.name,
        role:data.user.role,
        status:data.user.status,
        isDeleted:data.user.isDeleted,
        emailVerified:data.user.emailVerified
    })
     return {
        ...data,
        accessToken,                                
        refreshToken
     }
}


export const authService = {
    registeredPatient,
    loginUser
}