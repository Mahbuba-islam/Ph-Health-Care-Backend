import status from "http-status";
import { Role, Speciality } from "../../../generated/prisma/client"
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { IcreateAdmin, ICreateDoctorPayload } from "./userTypes";

const createDoctor = async (payload: ICreateDoctorPayload) => {
    
    const specialities:Speciality[] = [];

    for(const specialityId of payload.specialities){
     const speciality = await prisma.speciality.findUnique({
        where:{
            id:specialityId
        }
     })

     if(!speciality){
        throw new AppError(status.NOT_FOUND, "Speciality not found");
     }

     specialities.push(speciality!)
    }



    //chack  if doctor with same email already exists

    const userExists = await prisma.user.findUnique({
        where:{
            email: payload.doctor.email
        }
    })
    if(userExists){
        throw new AppError(status.BAD_REQUEST, "Doctor with same email already exists");
    }

    //create doctor
    const userData = await auth.api.signUpEmail({
        body:{
            email: payload.doctor.email,
            password: payload.password,
            name: payload.doctor.name,
             role: Role.DOCTOR,
             needPasswordChange: true
        }
    })


    //create doctor profile

    try {
        const result = await prisma.$transaction(async (tx) => {
        const doctorData = await tx.doctor.create({
            data:{
                userId: userData.user.id,
                ...payload.doctor,
            }
        })


         //doctor speciality data
        const doctorSpecialityData = specialities.map((speciality) => {
          return {
            doctorId : doctorData.id,
            specilityId:speciality.id
          }
        })


        //create doctor speciality
        await tx.doctorSpeciality.createMany({
            data:doctorSpecialityData
        })

        //get doctor with speciality and user data
         const doctor = await tx.doctor.findUnique({
            where:{
                id:doctorData.id
            },
            select:{
                id:true,
                userId:true,
                name:true,
                email:true,
                profilePhoto:true,
                address:true,
                registrationNumber:true,
                experience:true,
                gender:true,
                appointmentFee:true,
                qualification:true,
                currentWorkingPlace:true,
                designayion:true,
                user:{
                    select:{
                        id:true,
                        email:true,
                        name:true,
                        role:true,
                        status:true,
                        emailVerified:true,
                        createdAt:true,
                        updatedAt:true,
                        isDeleted:true,
                        deletedAt:true,
                    }
                },
                doctorSpecialities:{
                    select:{
                        specility:{
                            select:{
                                id:true,
                                title:true
                            }
                        }
                    }
                }
            }
         })
        return doctor
        })
        return result
    } catch (error) {
        console.log("transaction error", error);
        await prisma.user.delete({
            where:{
                id: userData.user.id
            }
        })
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create doctor profile");
    }

}




// create admin and admin profile

const createAdmin = async (payload: IcreateAdmin) => {
    //chack  if admin with same email already exists
    const existsUser = await prisma.user.findUnique({
        where:{
            email:payload.admin.email
        }
    })

    if(existsUser){
        throw new AppError(status.BAD_REQUEST, "user with same email already exists");
    }



    //create admin with betterAuth
    const userData = await auth.api.signUpEmail({
        body:{
            email:payload.admin.email,
            password:payload.password,
            name: payload.admin.name,
             role: Role.ADMIN,
             needPasswordChange: true
        }
    })


    //create admin profile
    try{
   const result = await prisma.$transaction(async(tx) => {
     const adminData = await tx.admin.create({
        data:{
            userId:userData.user.id,
            ...payload.admin
        }
     })



      //get admin wuth user data
    const admin = await prisma.admin.findUnique({
        where:{
            id: adminData.id
        },
        select:{
            user:{
                select:{
                    id:true,
                    email:true,
                    name:true,
                }
            }
        }

    })

    return admin


   })
   return result
    }

    catch(error){
        console.log("transaction error", error);
        await prisma.user.delete({
            where:{
                id:userData.user.id
            }
        })
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create admin profile");
    }

    
   
}
    











export const userService = {
    createDoctor,
    createAdmin
}
