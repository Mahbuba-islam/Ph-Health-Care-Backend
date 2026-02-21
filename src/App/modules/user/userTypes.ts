import { Gender } from "../../../generated/prisma/enums";



export interface ICreateDoctorPayload {
    password: string;
    doctor: {
    id: string;
    name: string;
    email: string;
    
    profilePhoto?: string;
    contactNUmber?: string;
    address?: string;
    isDeleted: boolean;
    deletedAt?: Date;
    registrationNumber: string;
    experience: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designayion: string;
    }
    specialities: string[];
}