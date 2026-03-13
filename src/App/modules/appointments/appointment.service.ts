/* eslint-disable @typescript-eslint/no-explicit-any */
import { uuidv7 } from "zod"
import { prisma } from "../../../lib/prisma"
import { IRequestUser } from "../../interfaces/requestUser.interface"
import { IBookAppointmentPayload } from "./appointment.interface"
import AppError from "../../errorHelpers/AppError"
import status from "http-status"
import { AppointmentStatus, PaymentStatus, Role } from "../../../generated/prisma/enums"
import { stripe } from "../../../config/stripe.config"
import { envVars } from "../../../config/env"
import {  IqueryParams } from "../../interfaces/query.interface"
import { Appointment, Prisma } from "../../../generated/prisma/client"
import { QueryBuilder } from "../../utilis/queryBuilder"

//book appointment with pay now
const bookAppointment = async (payload: IBookAppointmentPayload, user:IRequestUser) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })


    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where:{
            id:payload.doctorId,
            isDeleted:false
        }
    })

   const schduleData = await prisma.schedule.findUniqueOrThrow({
    where:{
        id:payload.scheduleId,
       
    }
   })


    const doctorSchdules = await prisma.doctorSchedules.findUniqueOrThrow({
    where:{
       doctorId_scheduleId:{
        doctorId:doctorData.id,
        scheduleId:schduleData.id
       }
    }
    })


    const videoCallingId = String(uuidv7)

    const result = await prisma.$transaction(async(tx)=> {
        const appointmentData = await tx.appointment.create({
            data:{
                doctorId:payload.doctorId,
                patientId:patientData.id,
                doctorScheduleId:doctorSchdules.scheduleId,
                videoCallingId
            }
        })


        await tx.doctorSchedules.update({
            where:{
                doctorId_scheduleId:{
                    doctorId:payload.doctorId,
                    scheduleId:payload.scheduleId
                }
            },
            data:{
                isBooked:true
            }
        })

        //todo payment integration will be here
        const transactionId = String(uuidv7())
        const paymentData = await tx.payment.create({
            data:{
                appointmentId:appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            line_items:[
                {
                    price_data:{
                        currency:"bdt",
                        product_data:{
                            name:`Appointment with Dr. ${doctorData.name}`
                        },
                        unit_amount:doctorData.appointmentFee *120,
                    },
                    quantity:1,

                }
            ],
            metadata:{
                appointmentId:appointmentData.id,
                paymentId:paymentData.id,
               
            },
         
            success_url:`${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,

            cancel_url:`${envVars.FRONTEND_URL}/dashboard/appointments`
            // cancel_url:`${envVars.FRONTEND_URL}/dashboard/payment/payment-success`
        })
        return{
       appointmentData,
       paymentData,
       paymentUrl:session.url
        } ;

    })
return {
     appointment:result.appointmentData,
       payment:result.paymentData,
       paymentUrl:result.paymentUrl
}
    
}  


//book appointment with pay later
const bookAppointmentWithPayLater = async (payload: IBookAppointmentPayload, user:IRequestUser) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })


    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where:{
            id:payload.doctorId,
            isDeleted:false
        }
    })

   const schduleData = await prisma.schedule.findUniqueOrThrow({
    where:{
        id:payload.scheduleId,
       
    }
   })


    const doctorSchdules = await prisma.doctorSchedules.findUniqueOrThrow({
    where:{
       doctorId_scheduleId:{
        doctorId:doctorData.id,
        scheduleId:schduleData.id
       }
    }
    })


    const videoCallingId = String(uuidv7)

    const result = await prisma.$transaction(async(tx)=> {
        const appointmentData = await tx.appointment.create({
            data:{
                doctorId:payload.doctorId,
                patientId:patientData.id,
                doctorScheduleId:doctorSchdules.scheduleId,
                videoCallingId
            }
        })


        await tx.doctorSchedules.update({
            where:{
                doctorId_scheduleId:{
                    doctorId:payload.doctorId,
                    scheduleId:payload.scheduleId
                }
            },
            data:{
                isBooked:true
            }
        })


         const transactionId = String(uuidv7())
        const paymentData = await tx.payment.create({
            data:{
                appointmentId:appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })
     
        return { appointment:appointmentData,
            payment:paymentData
             }
        

    })
return result;
    

    
}  



//initiatite payment
const initiatePayment = async(appointmentId:string, user:IRequestUser)=>{
    const patientData = await prisma.patient.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where:{
            id:appointmentId,
            patientId:patientData.id
        },
        include:{
            doctor:true,
            payment:true
        }
    })


    if(appointmentData.payment?.status === PaymentStatus.PAID){
        throw new AppError(status.BAD_REQUEST, "Payment already completed for this appointment")
    };


    if(appointmentData.status === AppointmentStatus.CANCELED) {
      throw new AppError(status.BAD_REQUEST, "Payment already completed for this appointment")
     }

     if(!appointmentData.payment){
        throw new AppError(status.BAD_REQUEST, "Payment not found")
     }

     const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            line_items:[
                {
                    price_data:{
                        currency:"bdt",
                        product_data:{
                            name:`Appointment with Dr. ${appointmentData.doctor.name}`
                        },
                        unit_amount:appointmentData.doctor.appointmentFee *120,
                    },
                    quantity:1,

                }
            ],
            metadata:{
                appointmentId:appointmentData.id,
                paymentId:appointmentData.payment.id,
               
            },
         
            success_url:`${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,

            cancel_url:`${envVars.FRONTEND_URL}/dashboard/appointments`
            // cancel_url:`${envVars.FRONTEND_URL}/dashboard/payment/payment-success`
        })

return {
    paymentUrl:session.url
}

};





// cancel unpaid appointment

const cancelUnpaidAppointments = async()=>{
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)

    const unpaidAppointments = await prisma.appointment.findMany({
        where:{
            // status:AppointmentStatus.SCHEDULED,
            createdAt:{
                lte:thirtyMinutesAgo
            },
        paymentStatus:PaymentStatus.UNPAID
        }
    })
 
    const appointmentToCancel = unpaidAppointments.map(appointment=> appointment.id)
   
    await prisma.$transaction(async(tx)=> {
        await tx.appointment.updateMany({
            where:{
                id:{
                    in:appointmentToCancel
                }
            },
            data:{
                status:AppointmentStatus.CANCELED
            }
        });


        await tx.payment.deleteMany({
            where:{
                appointmentId:{
                    in:appointmentToCancel
                }
            }
        });


        for(const unpaidAppointment of unpaidAppointments){
            await tx.doctorSchedules.update({
                where:{
                    doctorId_scheduleId:{
                        doctorId:unpaidAppointment.doctorId,
                        scheduleId:unpaidAppointment.doctorScheduleId
                    }
                   
                },
                 data:{
                        isBooked:false
                    }
            })
        }



    })
}




//getMyAppointment
const getMyAppointment = async (user:IRequestUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })


     const doctorData = await prisma.patient.findUniqueOrThrow({
        where:{
            email:user.email
        }
    })


    let appointments = []

    if(patientData){
        appointments = await prisma.appointment.findMany({
            where:{
                patientId:patientData.id
            },
            include:{
                doctor:true,
                doctorSchedule:true
            }
        })
}


 else if(doctorData){
        appointments = await prisma.appointment.findMany({
            where:{
                patientId:doctorData.id
            },
            include:{
                doctor:true,
                doctorSchedule:true
            }
        })
}

else{
    throw new AppError(status.NOT_FOUND, "user not found")
}
return appointments
};





//changeAppointmentStatus
const changeAppointmentStatus = async (appointmentId:string, appointmentStatus:AppointmentStatus, user:IRequestUser) => {
 const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where:{
        id:appointmentId,
        status:AppointmentStatus.SCHEDULED
    },
    include:{
        doctor:true
    }
 })


   const currentStatus = appointmentData.status;

    // 1. Terminal states cannot be changed
  if (currentStatus === AppointmentStatus.COMPLETED || currentStatus === AppointmentStatus.CANCELED) {
    throw new AppError(status.BAD_REQUEST, "Completed or Cancelled appointments cannot be updated");
  }

  // 2. Role-based logic
  if (user.role === Role.DOCTOR) {

    // Doctor must own the appointment
    if (user.email !== appointmentData.doctor.email) {
      throw new AppError(status.BAD_REQUEST, "This is not your appointment");
    }


    // Allowed transitions for doctor
    const allowedDoctorTransitions:Record<AppointmentStatus, AppointmentStatus[]> = {
      [AppointmentStatus.SCHEDULED]: [AppointmentStatus.INPROGRESS, AppointmentStatus.CANCELED],
      [AppointmentStatus.INPROGRESS]: [AppointmentStatus.COMPLETED],
       [AppointmentStatus.COMPLETED]: [],
      [AppointmentStatus.CANCELED]: []

    };


    const allowed = allowedDoctorTransitions[currentStatus] || []

       if (!allowed.includes(appointmentStatus)) {
      throw new AppError(status.BAD_REQUEST, "Invalid status transition for doctor");
    }
  }



  if (user.role === Role.PATIENT) {

    // Patient can only cancel scheduled appointments
    if (appointmentStatus !== AppointmentStatus.CANCELED) {
      throw new AppError(status.BAD_REQUEST, "Patients can only cancel appointments");
    }

     if (currentStatus !== AppointmentStatus.SCHEDULED) {
      throw new AppError(status.BAD_REQUEST, "Only scheduled appointments can be cancelled by patient");
    }


     // Admin & SuperAdmin → no restrictions

  return await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: appointmentStatus }
  });

  }


//  if(!appointmentData){
//     throw new AppError(status.NOT_FOUND, "Appointment not found or already completed/canceled")
//  }




if(user.role === Role.DOCTOR){
    if(!(user?.email === appointmentData.doctor.email)){
        throw new AppError(status.BAD_REQUEST, "this is not your appointment")
    }
}


};






//getMySingleAppointment
const getMySingleAppointment = async (appointmentId: string, user: IRequestUser) => {
  
 // 1. Fetch appointment with doctor + patient + user info
  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id: appointmentId },
    include: {
      doctor: {
        include: { user: true }
      },
      patient: {
        include: { user: true }
      },
      doctorSchedule: true
    }
  });


   // 2. Role-based access control
  if (user.role === Role.PATIENT) {
    if (appointment.patient.user.email !== user.email) {
      throw new AppError(status.FORBIDDEN, "You are not allowed to view this appointment");
    }
  }

   if (user.role === Role.DOCTOR) {
    if (appointment.doctor.user.email !== user.email) {
      throw new AppError(status.FORBIDDEN, "This is not your appointment");
    }
  }

// Admin & SuperAdmin → no restrictions

  return appointment;


}



const getAllAppointments = async (query: IqueryParams, user: IRequestUser) => {
  let initialQuery: Prisma.AppointmentWhereInput = {};

  // Role-based filtering
  if (user.role === "PATIENT") {
    initialQuery = {
      patient: {
        user: { email: user.email }
      }
    };
  }

  if (user.role === "DOCTOR") {
    initialQuery = {
      doctor: {
        user: { email: user.email }
      }
    };
  }

  // ADMIN → no filter (initialQuery stays empty)

  // Merge query params (search, filter, pagination)
  const qb = new QueryBuilder<
    Appointment,
    Prisma.AppointmentWhereInput,
    Prisma.AppointmentInclude
  >(
    prisma.appointment,
    { ...initialQuery, ...query },
    {
      searchableFields: ["paymentStatus"],
      filterableFields: ["paymentStatus"]
    }
  );

  const appointments = await qb
    .search()
    .filter()
    .paginate()
    .include({
      doctor: { include: { user: true } },
      patient: { include: { user: true } },
      doctorSchedule: true
    })
    .sort()
    .fields()
    .excute();

  return appointments;
};

export const appointmentService = {
    bookAppointment,
    getMyAppointment,
    changeAppointmentStatus,
    getMySingleAppointment,
    getAllAppointments,
    bookAppointmentWithPayLater,
    initiatePayment,
    cancelUnpaidAppointments
}