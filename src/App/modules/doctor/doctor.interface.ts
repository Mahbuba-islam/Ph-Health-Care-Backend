export interface updateDoctorInterface{
   
   name?: string,
    email?: string,
    profilePhoto?: string,
    contactNUmber?: string,
    address?: string,
    experience?: number,
    appointmentFee?: number,
    qualification?: string,
    currentWorkingPlace?: string,
    designayion?: string,
    specialities?:string[]
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