import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
   password: z.string("Password is required").min(8, "Password must be at least 8 characters long").max(100, "Password must be less than 100 characters long"),
    doctor:z.object({
    name: z.string("Name is required").min(5, "Name must be at least 5 characters long")
    .max(50, "Name must be less than 50 characters long"),

    email: z.email("Invalid email address"),

    contactNumber: z.string("Contact number is required")
    .min(11, "Contact number must be at least 10 characters long")
    .max(15, "Contact number must be less than 15 characters long").optional(),

    address: z.string("Address is required")
    .min(10, "Address must be at least 10 characters long")
    .max(100, "Address must be less than 100 characters long").optional(),
    
    registrationNumber: z.string("Registration number is required")
    .min(1, "Registration number is required"),
    
    qualification: z.string("Qualification is required").min(1, "Qualification is required").optional(),

    experience: z.int("Experience is required").nonnegative("Experience must be an integer")
    .optional(),
 
    gender:z.enum([Gender.MALE, Gender.FEMALE], "Gender must be either 'MALE' or 'FEMALE'").optional(),

    appoinmentfee: z.number("Appoinment fee is required").nonnegative("Appoinment fee must be a non-negative number").optional(),

    currentWorkingPlace: z.string("Current working place is required").min(5, "Current working place must be at least 5 characters long")
    .max(50, "Current working place must be less than 50 characters long").optional(),

    designayion: z.string("Degisnation is required").min(5, "Degisnation must be at least 5 characters long")
    .max(50, "Degisnation must be less than 50 characters long").optional(),

    specialities: z.array(z.string("Speciality must be a string").min(3, "Speciality must be at least 3 characters long")
    .max(50, "Speciality must be less than 50 characters long")).optional(),
  }),

  specialities: z.array(z.uuid(),"Speciality must be a string").min(1, "Speciality must be at least 1 speciality")
  


})





// create admin zod schema

export const createAdminZodSchema = z.object({
  password: z.string("Password is required").min(8, "Password must be at least 8 characters long")
  .max(50, "Password must be less than 100 characters long"),

  admin: z.object({
    name: z.string("Name is required").min(5, "Name must be at least 5 characters long")
    .max(20, "Name must be less than 20 characters long"),

    email: z.email("Invalid email address"),

    contactNumber: z.string("Contact number is required")
    .min(11, "Contact number must be at least 10 characters long")
    .max(15, "Contact number must be less than 15 characters long").optional(),

    address: z.string("Address is required")
    .min(10, "Address must be at least 10 characters long")
    .max(100, "Address must be less than 100 characters long").optional(),
 
    profilePhoto:z.url({ message: "Profile photo must be a valid URL" })
  .optional(),
 
  


  })

})




//create super admin zod schema
export const createSuperAdminZodSchema = z.object({
  password: z.string("Password is required").min(8, "Password must be at least 8 characters long")
  .max(50, "Password must be less than 100 characters long"),

  superAdmin: z.object({
    name: z.string("Name is required").min(5, "Name must be at least 5 characters long")
    .max(20, "Name must be less than 20 characters long"),

    email: z.email("Invalid email address"),

    contactNumber: z.string("Contact number is required")
    .min(11, "Contact number must be at least 10 characters long")
    .max(15, "Contact number must be less than 15 characters long").optional(),

    address: z.string("Address is required")
    .min(10, "Address must be at least 10 characters long")
    .max(100, "Address must be less than 100 characters long").optional(),
 
    profilePhoto:z.url({ message: "Profile photo must be a valid URL" })
  .optional(),
 
  


  })

})