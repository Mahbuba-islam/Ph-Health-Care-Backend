import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { updateDoctorInterface } from "./doctor.interface";

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
            }
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
   const {specialities, ...doctorData} = payload

   //update doctor basic information
   const updatedDoctor = await prisma.doctor.update({
        where:{id},
        data:doctorData,
        include:{
            doctorSpecialities:{
                include:{
                    specility:true
                }
            }
        }
    })

    // if specialities provided , update them seperately
    if(specialities && specialities.length>0){
        //delete old specialities
        await prisma.doctorSpeciality.deleteMany({
            where:{
            doctorId:id
            }
        })

        //add new specialities
        const specialitiesData = specialities.map(specilityId => ({
             doctorId:id,
             specilityId
        }))


        //create speciality with doctorid and specialityId
        await prisma.doctorSpeciality.createMany({
            data:specialitiesData 
        })

        //fetch updated doctor with new specialities
        const result = await prisma.doctor.findUnique({
            
        })

    }
    return updatedDoctor;
}


//soft delete doctor

const deleteDoctor = async(id:string) => {
    const sodtDeleteDoctor = await prisma.doctor.update({
        where:{id},
        data:{
            isDeleted: true,
            deletedAt: new Date()
        }
    })
    return sodtDeleteDoctor;
}






export const doctorService = {
    getAllDoctors,
    updateDoctor,
    getDoctorById,
    deleteDoctor
}