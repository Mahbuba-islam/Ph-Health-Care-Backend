import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponsr";
import { doctorService } from "./doctor.service";

const getAllDoctors = catchAsync(async (req, res) => {
    const doctors = await doctorService.getAllDoctors();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctors retrieved successfully",
        data: doctors,
    });
});



//get doctor by id
const getDoctorById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const doctor = await doctorService.getDoctorById(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor retrieved successfully",
        data: doctor,
    });
});




const updateDoctor = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const updatedDoctor = await doctorService.updateDoctor(id as string, data);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor updated successfully",
        data: updatedDoctor,
    });
});



//soft delete doctor
const deleteDoctor = catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedDoctor = await doctorService.deleteDoctor(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Doctor deleted successfully",
        data: deletedDoctor,
    });
});



export const doctorController = {
    getAllDoctors,
    updateDoctor,
    getDoctorById,
    deleteDoctor
}