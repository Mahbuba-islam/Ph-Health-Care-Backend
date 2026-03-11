
//create my doctor schdules

import { DoctorSchedules, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import { IqueryParams } from "../../interfaces/query.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { QueryBuilder } from "../../utilis/queryBuilder";
import { doctorScheduleFilterableFields, doctorScheduleIncludeConfig, doctorScheduleSearchableFields } from "./doctorSchdule.constant";
import { ICreateDoctorSchdulePayload, IUpdateDoctorSchdulePayloads } from "./doctorSchdules.interface";

const createMyDoctorSchdules = async (user: IRequestUser, payload:ICreateDoctorSchdulePayload) => {
 const doctorData = await prisma.doctor.findUnique({
    where:{
        email:user.email
    }
 })

 const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
    doctorId: doctorData!.id as string,
    scheduleId: scheduleId
}));


 const result = await prisma.doctorSchedules.createMany({
    data:doctorScheduleData

 })

 return result
}




//update doctor schdule data
const updateDoctorSchdule = async(user:IRequestUser, payload:IUpdateDoctorSchdulePayloads) =>{
  const doctorData = await prisma.doctor.findUniqueOrThrow({
   where:{
      email:user.email
   }
  })

  const deleteIds = payload.scheduleIds.filter(schdule => schdule.shouldDelete).map(schdule => schdule.id)
  const createIds = payload.scheduleIds.filter(schdule => !schdule.shouldDelete).map(schdule=> schdule.id)
  
  const result = await prisma.$transaction(async(tx) => {
   await tx.doctorSchedules.deleteMany({
      where:{
         doctorId:doctorData.id,
         scheduleId:{
            in:deleteIds
         }
      }
   })


   const doctorSchduleData = createIds.map(schduleId => ({
      doctorId:doctorData.id,
      scheduleId:schduleId
   }))

   const result = await tx.doctorSchedules.createMany({
      data:doctorSchduleData
   })
   return result
  })
return result
}




//get my doctor schdules 

const getMyDoctorSchdules = async (user:IRequestUser, query:IqueryParams) => {
 const doctorData = await prisma.doctor.findUniqueOrThrow({
   where:{
      email:user.email
   }
 })

 const queryBuilder = new QueryBuilder<DoctorSchedules, Prisma.DoctorSchedulesWhereInput, Prisma.DoctorSchedulesInclude>(
   prisma.doctorSchedules,
   {
      doctorId:doctorData.id,
      ...query
   },
   {
   filterableFields:doctorScheduleFilterableFields,
   searchableFields:doctorScheduleSearchableFields
   }
   
 )


 const doctorSchdules = await queryBuilder
 .search()
 .filter()
 .paginate()
 .include({
   schedule:true,
   doctor:{
      include:{
         user:true
      }
   }
 })
 .sort()
 .fields()
 .dynamicInclude(doctorScheduleIncludeConfig)
 .excute()
 return doctorSchdules
}




//get all doctor schdules 
const getAllDoctorSchdules = async (query:IqueryParams) => {
   const queryBuilder = new QueryBuilder<DoctorSchedules, Prisma.DoctorSchedulesWhereInput, Prisma.DoctorSchedulesInclude>(
      prisma.doctorSchedules,
      query,
      {
         filterableFields:doctorScheduleFilterableFields,
         searchableFields:doctorScheduleSearchableFields
      }
   )

   const result = await queryBuilder
   .search()
   .filter()
   .paginate()
   .dynamicInclude(doctorScheduleIncludeConfig)
   .sort()
   .excute()

   return result
}



//get doctor schdule by id
const getDoctorSchduleById = async (doctorId:string, schduleId:string) => {
  const doctorSchdule = await prisma.doctorSchedules.findUnique({
   where:{
      doctorId_scheduleId:{
         doctorId:doctorId,
         scheduleId:schduleId
      }
   },

   include:{
      schedule:true,
      doctor:true
   }

  })

  return doctorSchdule
}



//delete doctor schdule
const deleteDoctorSchdule = async(id:string, user:IRequestUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
   where:{
      email:user.email
   }
  })


  await prisma.doctorSchedules.deleteMany({
   where:{
      doctorId:doctorData.id,
      scheduleId:id
   }
  })
}



export const doctorSchdulesService = {
 createMyDoctorSchdules,
 updateDoctorSchdule,
 getMyDoctorSchdules,
 getAllDoctorSchdules,
 getDoctorSchduleById,
 deleteDoctorSchdule
}