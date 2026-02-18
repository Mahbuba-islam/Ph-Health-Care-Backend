import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsync = (fn: RequestHandler) => {
 return async(req:Request, res:Response, next:NextFunction)=>{
    try{
        await fn(req, res, next)
    }   catch(err){
    console.log(err);
    res.status(500).json({
        success:false,
        message:"failed to update specility",
        error: err instanceof Error ? err.message : 'UnKnown error'
    })
    }
 }
 

}
