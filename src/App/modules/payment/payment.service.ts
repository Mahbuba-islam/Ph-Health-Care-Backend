import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";

const handlerStripeWebhookEvent = async(event:Stripe.Event)=>{
 //cheack existing payment
 const existingPayment = await prisma.payment.findFirst({
    where:{
        stripeEventId:event.id
    }

   
 })
  if(existingPayment){
        console.log(`Event ${event.id} already processed. skipping`);
        return {message:`Event ${event.id} already processed. skipping`}
    }

    switch(event.type){
        case "checkout.session.completed":{
            const session = event.data.object
            const paymentId = session.metadata?.paymentId
            const appointmentId = session.metadata?.appointmentId

            if(!appointmentId || !paymentId){
        console.error("Missing appointment or paymentId in session metadata")
        return {message:"Missing appointment or paymentId in session metadata"}
            }

            const appointment = await prisma.appointment.findUnique({
                where:{
                    id:appointmentId
                }
            })


             if(!appointmentId){
        console.error(`appointment with ${appointmentId} not found`)
        return {message:`appointment with ${appointmentId} not found`}
            }

            await prisma.$transaction(async(tx)=> {
                await tx.appointment.update({
                    where:{
                        id:appointmentId
                    },
                    data:{
                        paymentStatus: session.payment_status === "paid"?
                        PaymentStatus.PAID : PaymentStatus.UNPAID
                    }
                });

                await tx.payment.update({
                    where:{
                        id:paymentId
                    },
                    data:{
                        stripeEventId:event.id,
                        status: session.payment_status === "paid" ?
                        PaymentStatus.PAID : PaymentStatus.UNPAID,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        paymentGateWayData:session as any,
                    }
                });
      });
      console.log(`processed checkout.session.completed for appointment ${appointment} and payment ${paymentId}`);
      break;



        }
            case "checkout.session.expired":{
                const session = event.data.object
                console.log(`checkout session ${session.id} expired. Marking assoicated payment as failed`);
                break;
            }

                case "payment_intent.payment_failed":{
                    const session = event.data.object
                    console.log(`payment intent ${session.id} failed. Marking assoicated payment as failed`);
                    break;
                }
                    default: 
                    console.log(`Unhandled event type ${event.type}`);
    }


    return {message: `WebHook Event ${event.id} processed successfully`}
}


export const paymentService ={
    handlerStripeWebhookEvent
}