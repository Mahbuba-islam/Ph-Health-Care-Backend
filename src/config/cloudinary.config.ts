import { v2 as cloudinary } from "cloudinary";
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

export const cloudinaryUpload = cloudinary;