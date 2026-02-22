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
   const {doctorSpecialities, ...doctorData} = payload

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
    if(doctorSpecialities && doctorSpecialities.length>0){
        //delete old specialities
        await prisma.doctorSpeciality.deleteMany({
            where:{
            doctorId:id
            }
        })

        //add new specialities
        const specialitiesData = doctorSpecialities.map(specilityId => ({
             doctorId:id,
             specilityId
        }))


        //create speciality with doctorid and specialityId
        await prisma.doctorSpeciality.createMany({
            data:specialitiesData 
        })

        //fetch updated doctor with new specialities
        const result = await prisma.doctor.findUnique({
            where:{id},
            include:{
                doctorSpecialities:{
                include:{
                    specility:true
                }
            }}
        })
        return {
            ...result,
            doctorSpecialities:result?.doctorSpecialities.map(s => s.specility)
        }


    }
    
        return {
            ...updatedDoctor,
            DoctorSpecialities:updatedDoctor.doctorSpecialities.map(s => s.specility)
        }
}


//soft delete doctor

const deleteDoctor = async(id:string) => {
    //cheack if doctor exists 
    const doctor = await prisma.doctor.findUnique({
        where:{
            id
        }
    })

    if(!doctor){
    throw new AppError(status.NOT_FOUND, "Doctor not found")
    }

    //cheack doctor already deleted
    if(doctor.isDeleted){
        throw new AppError(status.BAD_REQUEST, "This doctor is already deleted");
        
    }

    
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