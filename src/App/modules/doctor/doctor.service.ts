import { prisma } from "../../../lib/prisma";
import { updateDoctorInterface } from "./doctor.interface";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        where:{
            isDeleted: false
        },
        include: {
            user: true,
            doctorSpecialities:{
                include: {specility: true}
            }
        },
    });
    return doctors;
}




//get doctor by id
const getDoctorById = async (id:string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {id},
        include: {
            user: true,
            doctorSpecialities:{
                include: {specility: true}
            }
        },
    });
    return doctor;
}




//update doctor

const updateDoctor = async(id:string, data:updateDoctorInterface) => {
   const updatedDoctor = await prisma.doctor.update({
        where:{id},
        data
    })
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