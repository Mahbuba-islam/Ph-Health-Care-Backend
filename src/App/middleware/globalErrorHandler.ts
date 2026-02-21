import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";
import z from "zod";
import { IError, IErrorResponse } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";




// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err:Error, _req:Request, res:Response, _next:NextFunction) => {

    if(envVars.NODE_ENV === 'development'){
        console.log('error from global error handler', err);
    }

    let errorSource:IError[] = []
    let statusCode : number = status.INTERNAL_SERVER_ERROR
    let message: string = 'Internal server error'
    let stack: string | undefined = undefined

    // if(err instanceof z.ZodError){
    //   const simplifiedError = handleZodError(err)
    //   statusCode = simplifiedError.statusCode as number
    //     message = simplifiedError.message
    //     errorSource= [ ...simplifiedError.errorSource]
    // }


    if(err instanceof z.ZodError){
      const simplifiedError = handleZodError(err)
      statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSource= [ ...simplifiedError.errorSource]
    }

  else if(err instanceof AppError){
    statusCode = err.statusCode
    message = err.message
    stack = err.stack
    errorSource = [
        {
            path:"",
            message: err.message
        }
    ]
  }

    else if(err instanceof Error){
     statusCode = status.INTERNAL_SERVER_ERROR
     message = err.message
     stack = err.stack;
        errorSource = [
            {
                path:"",
                message: err.message
            }
        ]
    }

    const errorResponse: IErrorResponse = {
        success:false,
        message:message,
        errorSource,
        error:envVars.NODE_ENV ==='development'? err : undefined,
        stack:envVars.NODE_ENV === 'development' ? stack : undefined,
    }

   res.status(statusCode).json(errorResponse)
}