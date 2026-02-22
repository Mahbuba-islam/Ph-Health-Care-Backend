import status from "http-status"
import { prisma } from "../../../lib/prisma"
import AppError from "../../errorHelpers/AppError"
import { IupdateAdmin } from "./admin.interface"

///get all admin service
const getAllAdmin = async() => {
 const admins = await prisma.admin.findMany({
  where:{isDeleted:false},
  
  include:{
    user:true
  }
 })

 if(!admins){
    throw new AppError(status.NOT_FOUND, "admins not found")
 }
 return admins
}


//get admin by id service
const getAdminbyId = async(id:string) => {
 const admin = await prisma.admin.findUnique({
    where:{
        id,
        isDeleted:false
    }
 })

 if(!admin){
    throw new AppError(status.NOT_FOUND, "admin in this id not found")
 }

 return admin
}


//update admin by id

const updateAdmin = async(id:string, payload:IupdateAdmin)=>{
    //cheack if admin exists
    const admin = await prisma.admin.findUnique({
    where:{
        id,
        isDeleted:false
    }
 })

 if(!admin){
    throw new AppError(status.NOT_FOUND, "admin in this id not found")
 }

 //update admin
    const updatedAdmin = await prisma.admin.update({
        where:{id},
          data:payload,
         
         include:{
          user:true
         }
    })
    return updatedAdmin
}





//soft delete admin 
const markDeleteAdmin = async(id:string)=>{
     //cheack if admin exists
    const admin = await prisma.admin.findUnique({
    where:{
        id,
        isDeleted:false
    }
 })

 if(!admin){
    throw new AppError(status.NOT_FOUND, "admin in this id not found")
 }

 if(admin.isDeleted){
    throw new AppError(status.BAD_REQUEST, "admin in this id already deleted")
 }

 //soft delete admin
 const results = await prisma.admin.update({
    where:{id},
     data:{
            isDeleted: true,
            deletedAt: new Date()
        }
    
 })

 return results

}




export const adminService = {
    getAllAdmin,
    updateAdmin,
    getAdminbyId,
    markDeleteAdmin
}