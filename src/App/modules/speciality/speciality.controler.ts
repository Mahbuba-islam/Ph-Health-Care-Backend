import { Request, Response } from "express";
import { specialityService } from "./speciality.service";
import { sendResponse } from "../../../shared/sendResponsr";
import { catchAsync } from "../../../shared/catchAsync";
import status from "http-status";

const createSpeciality = catchAsync(
    async(req:Request, res:Response)=> {
     const payload = {
      ...req.body,
      icon:req.file?.path
     }
     console.log(req.file);
     console.log('payload',payload);
    const result = await specialityService.createSpeciality(payload)

    sendResponse(res, {
        httpStatusCode:status.CREATED,
        success:true,
        message:"specility created successfully",
        data:result
    })

    }
)
    
    
    
//  get all Specility
const getAllSpeciality = catchAsync(
    async(req:Request, res:Response) => {
const result = await specialityService.getAllSpecility()
   sendResponse(res, {
        httpStatusCode:status.OK,
        success:true,
        message:"specility created successfully",
        data:result
    } )
    }
)
    





//  delete Specility
const deleteSpeciality = catchAsync(
    async(req:Request, res:Response) => {
    const {id} = req.params
    const result = await specialityService.deleteSpecility(id as string)
  sendResponse(res, {
        httpStatusCode:status.OK,
        success:true,
        message:"Speciality deleted successfully",
        data:result
    } )
    }
)



//  update Specility
const updateSpeciality = catchAsync(
    async(req:Request, res:Response) => {
    const {id} = req.params
        const data = req.body
        console.log(req.body);
    const result = await specialityService.updateSpeciality(id as string, data)
  sendResponse(res, {
        httpStatusCode:status.OK,
        success:true,
        message:"Speciality updated successfully",
        data:result
    } )
    }
)





export const specialityControler = {
    createSpeciality,
    getAllSpeciality,
    deleteSpeciality,
    updateSpeciality
}