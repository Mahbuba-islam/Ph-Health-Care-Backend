import z from "zod";

export const createspecialityZodSchema = z.object({
    title:z.string("title is required"),
    description:z.string("Description is required").optional(),
   
})