/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { tokenUtils } from "../../utilis/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtil } from "../../utilis/jwt";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IChangePasswordPayload, IGoogleSessionPayload, ILoginUserPayload, IRegisteredPatientPayload } from "./auth.interface";




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





//get me

const getMe = async(user:IRequestUser) => {
 const isUserExists = await prisma.user.findUnique({
    where:{
        id:user.userId
    },
    include:{
        patient:{
            include:{
                 appointments:true,
                reviews:true,
                prescription:true,
                medicalReports:true,
                patientHealthData:true
            }
        },
        doctors:{
            include:{
                doctorSpecialities:true,
                appointments:true,
                reviews:true,
                prescription:true
            },
        },
        admin:true,
        superAdmin:true
    }
 })

 if(!isUserExists){
    throw new AppError(status.NOT_FOUND, "user not found")
 }

 return isUserExists
}


//get new token
const getNewToken = async(refreshToken:string, sessionToken:string)=> {

    const isSessionTokenExists = await prisma.session.findUnique({
      where:{
        token:sessionToken,
     } ,
      include:{
        user:true
      }
    })


    if(!isSessionTokenExists){
        throw new AppError(status.UNAUTHORIZED, "Invalid session token")
    }


    const verifyRefreshToken = jwtUtil.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET)
    if(!verifyRefreshToken.success){
     throw new AppError(status.UNAUTHORIZED, "invalid refresh token")
    };
console.log('verifyRefreshToken', verifyRefreshToken);
    const data = verifyRefreshToken.data as JwtPayload
  console.log('data',data.userId);
   const newAccessToken = tokenUtils.getAccessToken({
        userId:data.userId,
        email:data.email,
        name:data.name,
        role:data.role,
        status:data.status,
        isDeleted:data.isDeleted,
        emailVerified:data.emailVerified
    })

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId:data.id,
        email:data.email,
        name:data.name,
        role:data.role,
        status:data.status,
        isDeleted:data.isDeleted,
        emailVerified:data.emailVerified
    })

   // update session token
    const {token} = await prisma.session.update({
        where:{
            token:sessionToken
        },
        data:{
            token:sessionToken,
            expiresAt:new Date(Date.now()+60*60*60*24*1000),
            updatedAt: new Date()
        }
    })



    return {
        accessToken:newAccessToken,
        refreshToken:newRefreshToken,
        sessionToken:token
    }
}






//change password
const changePassword = async(payload:IChangePasswordPayload, sessionToken:string)=>{
  const session = await auth.api.getSession({
    headers:new Headers({
        Authorization:`Bearer ${sessionToken}`
    })
  })
  console.log(session);
  if(!session){
    throw new AppError(status.UNAUTHORIZED, "Invalid session token")
  }

const {currentPassword, newPassword} = payload

const result = await auth.api.changePassword({
    body:{
        currentPassword,
        newPassword,
        revokeOtherSessions:true
    },
    headers: new Headers({
        Authorization:`Bearer ${sessionToken}`
    })

})
if(session.user.needPasswordChange){
await prisma.user.update({
    where:{
        id:session.user.id
    },
    data:{
        needPasswordChange:false
    }
 })
}
 
console.log('session', session?.user);

const accessToken = tokenUtils.getAccessToken({
        userId:session.user.id,
        email:session.user.email,
        name:session.user.name,
        role:session.user.role,
        status:session.user.status,
        isDeleted:session.user.isDeleted,
        emailVerified:session.user.emailVerified
    })

    const refreshToken = tokenUtils.getRefreshToken({
        userId:session.user.id,
        email:session.user.email,
        name:session.user.name,
        role:session.user.role,
        status:session.user.status,
        isDeleted:session.user.isDeleted,
        emailVerified:session.user.emailVerified
    })
return {
  ...result,
  accessToken,
  refreshToken
}
} 


//logout
const logOutUser = async(sessionToken:string)=>{
    const result = await auth.api.signOut({
        headers: new Headers({
            Authorization:`Bearer ${sessionToken}`
        })
    })
    return result
}



//verify email
const verifyEmail = async(email:string, otp:string)=>{
    const result = await auth.api.verifyEmailOTP({
        body:{
            email,otp
        }
    })
    if(result.status && !result.user.emailVerified){
        await prisma.user.update({
            where:{
                email,
            },
            data:{
                emailVerified:true
            }
        })
    }
}


//forget password
const forgetPassword = async(email:string)=>{
    const isUserExists = await prisma.user.findUnique({
        where:{
            email
        }
    })

    if(!isUserExists){
        throw new AppError(status.NOT_FOUND, "user not found")
    }
    if(!isUserExists.emailVerified){
          throw new AppError(status.BAD_REQUEST, "email not verified")
    }
    if(isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED){
         throw new AppError(status.NOT_FOUND, "user not found")
    }

    await auth.api.requestPasswordResetEmailOTP({
        body:{
            email
        }
    })
}


//reset password
const resetPassword = async(email:string, otp:string, newPassword:string) => {
   const isUserExists = await prisma.user.findUnique({
        where:{
            email
        }
    })

    if(!isUserExists){
        throw new AppError(status.NOT_FOUND, "user not found")
    }

    if(!isUserExists.emailVerified){
          throw new AppError(status.BAD_REQUEST, "email not verified")
    }

    if(isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED){
         throw new AppError(status.NOT_FOUND, "user not found")
    }

    await auth.api.resetPasswordEmailOTP({
        body:{
            email,
            otp,
            password:newPassword
        }
    })

    //update need password change true

    if(isUserExists.needPasswordChange){
await prisma.user.update({
    where:{
        id:isUserExists.id
    },
    data:{
        needPasswordChange:false
    }
 })
}

   // delete all session for this user
    await prisma.session.deleteMany({
        where:{
            userId:isUserExists.id
        }
    })



}







  //googleLoginSuccess
const googleLoginSuccess = async(session:IGoogleSessionPayload)=>{
  const isPatientExists = await prisma.patient.findUnique({
    where:{
        userId:session.user.id
    }
  })

  if(!isPatientExists){
    await prisma.patient.create({
        data:{
            userId:session.user.id,
            name:session.user.name,
            email:session.user.email,
        }

    })
  }

  const accessToken = tokenUtils.getAccessToken({
    userId:session.user.id,
    role:session.user.role,
    name:session.user.name,
   
  })
  const refreshToken = tokenUtils.getRefreshToken({
    userId:session.user.id,
    role:session.user.role,
    name:session.user.name,
   
  })

  return{
    accessToken,
    refreshToken
  }
}





export const authService = {
    registeredPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logOutUser,
    verifyEmail,
    forgetPassword,
    resetPassword,
    googleLoginSuccess,
    
}