import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../App/errorHelpers/AppError";
import status from "http-status";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});


// delete file from cloudinary 
export const deleteFileFromCloudinary = async(url:string) => {
  try{
   const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
  const match = url.match(regex)
  if(match && match[1]){
    const publicId = match[1];
    await  cloudinary.uploader.destroy(
      publicId,{
        resource_type:"image"
      }
    )

    console.log(`file ${publicId} deleted from cloudinary`);
  }
  }
  catch(e){
    console.error("failed to delete from cloudinary", e)
    throw new AppError(status.INTERNAL_SERVER_ERROR, "failed to delete")
  }
 
}



//manual function for file upload
export const uploadFileTocloudinary = async(
  buffer:Buffer,
  fileName:string
) : Promise<UploadApiResponse> => {


  if(!buffer || !fileName){
    throw new AppError(status.BAD_REQUEST, "File Buffer and File Name are required")
  }


   
    const extention = fileName.split(".").pop()?.toLocaleLowerCase();

    const fileNameWithoutExtension = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .toLocaleLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9/-]/g, "")

    const uniqueName = Math.random().toString(36).substring(2)+ "-" +Date.now()+ "-"+ fileNameWithoutExtension

    const folder = extention === "pdf"? "pdfs" : "images";

    return new Promise((resolve, reject) => {
     cloudinary.uploader.upload_stream({
      folder: `ph-health-care/${folder}`,
     public_id:uniqueName,
     resource_type: "auto"
     },

     (error, result)=>{
      if(error){
        return reject(new AppError(status.INTERNAL_SERVER_ERROR, "failed to upload file"))
      }

      resolve(result as UploadApiResponse)
     }
    ).end(buffer)

    }) 
  
}




export const cloudinaryUpload = cloudinary;