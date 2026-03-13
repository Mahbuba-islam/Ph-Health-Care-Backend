/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { envVars } from "../../../config/env";
import status from "http-status";
import { stripe } from "../../../config/stripe.config";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../../shared/sendResponsr";

const handlerStripeWebhookEvent = catchAsync(async(req:Request, res:Response)=>{
    const signuture = req.headers['stripe-signature'] as string
    const webhooksecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET

    if(!signuture || !webhooksecret){
        console.error("Missing stripe signature or webhook secret")
        return res.status(status.BAD_REQUEST).json({message:"Missing stripe signature or webhook secret"})
    }

    let event;

    try{
        event = stripe.webhooks.constructEvent(req.body, signuture, webhooksecret)
    }
    catch(error:any){
     console.error("Error processing Stripe webhook:", error)
     return res.status(status.BAD_REQUEST).json({message:"Error processing Stripe webhook"})
    }

    try{
        const result = await paymentService.handlerStripeWebhookEvent(event)
        sendResponse(res, {
            httpStatusCode:status.OK,
            success:true,
            message:"Stripe webhook processed successfully",
            data:result
        })
    }
    catch(error:any){
         console.error("Error handling Stripe webhook:", error)
     return res.status(status.INTERNAL_SERVER_ERROR).json({message:"Error handling Stripe webhook"})
    }
})




export const paymentControler ={
    handlerStripeWebhookEvent
}