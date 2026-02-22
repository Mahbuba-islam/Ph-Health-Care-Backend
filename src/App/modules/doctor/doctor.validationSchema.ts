import z from "zod";

export const updateDoctorValidationSchema = z.object({
   body:z.object({
    name:z.string().optional(),
    profilePhoto:z.url("Invalid url formate").optional(),
    contactNumber:z.string().optional(),
    zender:z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    appoinmentfee: z.number().positive("Appoinment fee must be positive").optional(),
   qualification:z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    designayion: z.string().optional(),
    specialities: z.array(z.uuid("Speciality must be a valid uuid")).optional(),
   })
})


