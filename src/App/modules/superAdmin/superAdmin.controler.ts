import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponsr";
import { superAdminService } from "./superAdmin.service";


// get all admins controler
const getAllSuperAdmin = catchAsync(async (req, res) => {
    const admins = await superAdminService.getAllSuperAdmin;
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admins retrieved successfully",
        data: admins,
    });
});



//get admin by id controler
const getSuperAdminById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const admin = await superAdminService.getSuperAdminbyId(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "admin retrieved successfully",
        data: admin,
    });
});




// update admin controler

const updateSuperAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const updatedAdmin = await superAdminService.updateSuperAdmin(id as string, data);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admin updated successfully",
        data: updatedAdmin,
    });
});



//soft delete admin controler
const deleteSuperAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const adminDoctor = await superAdminService.markDeleteSuperAdmin(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "admin deleted successfully",
        data: adminDoctor,
    });
});



export const superAdminController = {
    getAllSuperAdmin,
    updateSuperAdmin,
    getSuperAdminById,
    deleteSuperAdmin
}