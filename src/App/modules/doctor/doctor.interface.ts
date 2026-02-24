import { Gender } from "../../../generated/prisma/enums"

export interface IUpdateDoctorSpeacilities{
    specilityId:string,
    shouldDelete?:boolean
}


export interface updateDoctorInterface{
   doctor:{
    name?: string,
    profilePhoto?: string,
    contactNUmber?: string,
    address?: string,
    experience?: number,
    registrationNumber?:string,
    gender?:Gender,
    appointmentFee?: number,
    qualification?: string,
    currentWorkingPlace?: string,
    designayion?: string,
   }
  
    doctorSpecialities?:IUpdateDoctorSpeacilities[]
    }
    
   




// model Doctor {
//     id                  String             @unique @default(uuid(7))
//     name                String
//     email               String             @unique
//     profilePhoto        String?
//     contactNUmber       String?
//     address             String?
//     isDeleted           Boolean            @default(false)
//     deletedAt           DateTime?
//     registrationNumber  String             @unique
//     experience          Int                @default(0)
//     gender              Gender
//     appointmentFee      Float              @default(0.0)
//     qualification       String
//     currentWorkingPlace String
//     designayion         String
//     avarageRating       Float              @default(0.0)
//     userId              String             @unique
//     user                User               @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
//     createdAt           DateTime           @default(now())
//     updatedAt           DateTime           @updatedAt
//     doctorSpecialities  DoctorSpeciality[]

//     @@index([email], name: "idx_doctor_email")
//     @@index([isDeleted], name: "idx_doctor_isDeleted")
//     @@map("doctor")
// }