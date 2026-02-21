import status from "http-status"
import z from "zod"
import { IError, IErrorResponse } from "../interfaces/error.interface"

export const handleZodError = (err: z.ZodError):IErrorResponse => {
     const statusCode = status.BAD_REQUEST
       const message = 'Zod Validation error'
       const errorSource: IError[] = []
            err.issues.forEach(issue => {
                errorSource.push({
                    path: issue.path.join('.') || "unknown",
                    message: issue.message
                })
            })
            return {
                success: false,
                message,
                errorSource,
                statusCode
            }
}