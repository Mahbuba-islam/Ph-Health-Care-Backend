import z from "zod";

export const updateSuperAdminValidationSchema = z.object({
    body:z.object({
   contactNumber:z.string().optional(),
    profilePhoto:z.string().optional()
    
    })
         
})