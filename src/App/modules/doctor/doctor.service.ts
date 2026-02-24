import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { updateDoctorInterface } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";

const getAllDoctors = async () => {
    const results = await prisma.doctor.findMany({
        where:{
            isDeleted: false
        },
        orderBy:{
            createdAt:"desc"
        },
        select:{
            id:true,
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
            createdAt:true,
            updatedAt:true,
            doctorSpecialities:{
                select:{
                   specility:{
                        select:{
                            id:true,
                            title:true
                        }
                    }
        }     },
       
    
    }
})

// transform specialities(flaten structure)
const doctors = results.map((doctor)=> ({
    ...doctor,
    doctorSpecialities:doctor.doctorSpecialities.map(s => s.specility)
}))
    return doctors
}




//get doctor by id
const getDoctorById = async (id:string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {id, isDeleted:false},
        include: {
            user: true,
            doctorSpecialities:{
                include: {specility: true}
            },
            appointments:{
                include:{
                    patient:true,
                    doctorSchedule:true,
                    prescription:true
                },
             },
             doctorSchedules:{
                include:{
                    schedule:true,

                }
             },
             reviews:true
        },

        
    });
    if(!doctor){
        throw new AppError(status.NOT_FOUND, "Doctors not found")
    }

    // transform specialities to flatten straucture 
    return{
   ...doctor,
 doctorSpecialities:doctor.doctorSpecialities.map(s => s.specility)
    }
   
}




//update doctor

const updateDoctor = async(id:string, payload:updateDoctorInterface) => {
    //check if doctor exists and not deleted
    const existingDoctor = await prisma.doctor.findUnique({
        where:{
            id, isDeleted:false
        }
    });


    if(!existingDoctor){
        throw new AppError(status.NOT_FOUND, "Doctors not found")
    }

    //seperate specialities from doctor data
   const {doctor:doctorData, doctorSpecialities} = payload
 
   await prisma.$transaction(async(tx)=> {
    if(doctorData){
    await tx.doctor.update({
        where:{id},
        data:{
        ...doctorData
        },
        include:{
            doctorSpecialities:{
                include:{
                    specility:true
                }
            }
        }
    })
    }
    


         // if specialities provided , update them seperately
  
     if(doctorSpecialities && doctorSpecialities.length>0){
       
        for(const speciality of doctorSpecialities){
            const {specilityId, shouldDelete} = speciality
            if(shouldDelete){
                await tx.doctorSpeciality.delete({
                    where:{
                        doctorId_specilityId:{
                            doctorId:id,
                            specilityId,
                        }
                    }
                })
            }

            else{
                await tx.doctorSpeciality.upsert({
                    where:{
                        doctorId_specilityId:{
                            doctorId:id,
                            specilityId,
                        }
                    },
                    create:{
                        doctorId:id,
                        specilityId,
                    },
                    update:{}
                })
            }
        }
        

}
   })


   const doctor = await getDoctorById(id)

   return doctor

}




//soft delete doctor

const deleteDoctor = async(id:string) => {
    //cheack if doctor exists 
    const doctor = await prisma.doctor.findUnique({
        where:{id},
        include:{user:true}
    })



    if(!doctor){
    throw new AppError(status.NOT_FOUND, "Doctor not found")
    }


    await prisma.$transaction(async(tx)=> {
        await tx.doctor.update({
            where:{
                id
            },
            data:{
                isDeleted:true,
                deletedAt:new Date()
            },
        })
 
         await tx.user.update({
        where:{id:doctor.userId},
        data:{
            isDeleted:true,
            deletedAt:new Date(),
            status:UserStatus.DELETED
        }
    })


    await tx.session.deleteMany({
        where:{userId:doctor.userId}
    })

    await tx.doctorSpeciality.deleteMany({
        where:{doctorId:id}
    })
          
    })

 
return {message:"Doctor Deleted successfully"}

  
}






export const doctorService = {
    getAllDoctors,
    updateDoctor,
    getDoctorById,
    deleteDoctor
}