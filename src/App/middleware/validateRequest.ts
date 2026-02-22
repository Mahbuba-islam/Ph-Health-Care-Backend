// import { NextFunction, Request, Response } from "express"
// import z from "zod"

// export const validateRequest =(zodSchema: z.ZodObject) => {
//     return(req:Request, res:Response, next:NextFunction) => {
//         const parsedResult = zodSchema.safeParse(req.body)
//         if(!parsedResult.success){
//             next(parsedResult.error)
//         }
//         //sanitizing data
//         req.body = parsedResult.data
//         next()
//     }
// }



 // support any zod schema

import { NextFunction, Request, Response } from "express"
import { ZodType } from "zod"

export const validateRequest = (zodSchema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedResult = zodSchema.safeParse(req.body)

    if (!parsedResult.success) {
      return next(parsedResult.error)
    }

    req.body = parsedResult.data
    next()
  }
}



