import z from "zod";

export const updateAdminValidationSchema = z.object({
    body:z.object({
   contactNumber:z.string().optional(),
    profilePhoto:z.string().optional()
    
    })
         
})