import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponsr";
import { adminService } from "./admin.service";
 

// get all admins controler
const getAllAdmin = catchAsync(async (req, res) => {
    const admins = await adminService.getAllAdmin();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admins retrieved successfully",
        data: admins,
    });
});



//get admin by id controler
const getAdminById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const admin = await adminService.getAdminbyId(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "admin retrieved successfully",
        data: admin,
    });
});




// update admin controler

const updateAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const updatedAdmin = await adminService.updateAdmin(id as string, data);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admin updated successfully",
        data: updatedAdmin,
    });
});



//soft delete admin controler
const deleteAdmin = catchAsync(async (req, res) => {
    const { id } = req.params;
    const adminDoctor = await adminService.markDeleteAdmin(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "admin deleted successfully",
        data: adminDoctor,
    });
});



export const adminController = {
    getAllAdmin,
    updateAdmin,
    getAdminById,
    deleteAdmin
}