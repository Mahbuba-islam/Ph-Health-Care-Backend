import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponsr";
import { IqueryParams } from "../../interfaces/query.interface";
import { schedulesService } from "./schedules.service";



const createSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const schedule = await schedulesService.createSchdules(payload);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Schedule created successfully',
        data: schedule
    });
});


const getAllSchedules = catchAsync( async (req : Request, res : Response) => {
    const query = req.query;
    const result = await schedulesService.getAllSchedules(query as IqueryParams);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});



const getScheduleById = catchAsync( async (req : Request, res : Response) => {
    const { id } = req.params;
    const schedule = await schedulesService.getScheduleById(id as string);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule retrieved successfully',
        data: schedule
    });
});



const updateSchedule = catchAsync( async (req : Request, res : Response) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedSchedule = await schedulesService.updateSchedule(id as string, payload);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule updated successfully',
        data: updatedSchedule
    });
});



const deleteSchedule = catchAsync( async (req : Request, res : Response) => {
    const { id } = req.params;
    await schedulesService.deleteSchedule(id as string);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule deleted successfully',
    });
}
);




export const ScheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
}