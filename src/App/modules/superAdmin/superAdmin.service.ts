import status from "http-status"
import { prisma } from "../../../lib/prisma"
import AppError from "../../errorHelpers/AppError"
import { IupdateSuperAdmin } from "./superAdmin.interface"

///get all admin service
const getAllSuperAdmin = async() => {
 const superAdmins = await prisma.superAdmin.findMany({
  where:{isDeleted:false},
  
  include:{
    user:true
  }
 })

 if(!superAdmins){
    throw new AppError(status.NOT_FOUND, "super admins not found")
 }
 return superAdmins
}


//get admin by id service
const getSuperAdminbyId = async(id:string) => {
 const superAdmin = await prisma.superAdmin.findUnique({
    where:{
        id,
        isDeleted:false
    }
 })

 if(!superAdmin){
    throw new AppError(status.NOT_FOUND, "super admin in this id not found")
 }

 return superAdmin
}


//update admin by id

const updateSuperAdmin = async(id:string, payload:IupdateSuperAdmin)=>{
    //cheack if admin exists
    const superAdmin = await prisma.superAdmin.findUnique({
    where:{
        id,
        isDeleted:false
    }
 })

 if(!superAdmin){
    throw new AppError(status.NOT_FOUND, "super admin in this id not found")
 }

 //update superAdmin
    const updatedSuperAdmin = await prisma.superAdmin.update({
        where:{id},
          data:payload,
         
         include:{
          user:true
         }
    })
    return updatedSuperAdmin
}





//soft delete admin 
const markDeleteSuperAdmin = async(id:string)=>{
     //cheack if admin exists
    const superAdmin = await prisma.superAdmin.findUnique({
    where:{
        id,
        isDeleted:false
    }
 })

 if(!superAdmin){
    throw new AppError(status.NOT_FOUND, "super admin in this id not found")
 }

 if(superAdmin.isDeleted){
    throw new AppError(status.BAD_REQUEST, "super admin in this id already deleted")
 }

 //soft delete superAdmin
 const results = await prisma.superAdmin.update({
    where:{id},
     data:{
            isDeleted: true,
            deletedAt: new Date()
        }
    
 })

 return results

}




export const superAdminService = {
    getAllSuperAdmin,
    updateSuperAdmin,
    getSuperAdminbyId,
    markDeleteSuperAdmin
}