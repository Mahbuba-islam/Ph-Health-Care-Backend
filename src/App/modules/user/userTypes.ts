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






export interface IcreateAdmin {
    password: string;
    admin:{
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    isDeleted?: boolean;
    deletedAt?: Date
    

    }
    
}



  // create super admin interface
export interface IcreateSuperAdmin {
    password: string;
    admin:{
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    isDeleted?: boolean;
    deletedAt?: Date
    

    }
    
}