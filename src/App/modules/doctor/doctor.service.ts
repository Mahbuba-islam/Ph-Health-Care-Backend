import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { updateDoctorInterface } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { IqueryParams } from "../../interfaces/query.interface";
import { QueryBuilder } from "../../utilis/queryBuilder";
import { Doctor, Prisma } from "../../../generated/prisma/client";
import { doctorFilterableFields, doctorIncludeConfig, doctorSearchableFields } from "./doctor.constant";

const getAllDoctors = async (query : IqueryParams) => {
    // const doctors = await prisma.doctor.findMany({
    //     where: {
    //         isDeleted: false,
    //     },
    //     include: {
    //         user: true,
    //         specialties: {
    //             include: {
    //                 specialty: true
    //             }
    //         }
    //     }
    // })

    // // const query = new QueryBuilder().paginate().search().filter();
    // return doctors;

    const queryBuilder = new QueryBuilder<Doctor, Prisma.DoctorWhereInput, Prisma.DoctorInclude>(
        prisma.doctor,
        query,
        {
            searchableFields: doctorSearchableFields,
            filterableFields: doctorFilterableFields,
        }
    )

    const result = await queryBuilder
        .search()
        .filter()
        .where({
            isDeleted: false,
        })
        .include({
            user: true,
            // specialties: true,
            doctorSpecialities: {
                include:{
                    specility: true
                }
            },
        })
        .dynamicInclude(doctorIncludeConfig)
        .paginate()
        .sort()
        .fields()
        .excute();

        console.log(result);
    return result;
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