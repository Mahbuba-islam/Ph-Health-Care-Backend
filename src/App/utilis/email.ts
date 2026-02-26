/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer"
import { envVars } from "../../config/env"
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import path from "node:path";
import ejs from "ejs"


//transporter
const transporter = nodemailer.createTransport({
    host:envVars.EMAIL_SENDER.SMTP_HOST,
    secure:true,
    auth:{
        user:envVars.EMAIL_SENDER.SMTP_USER,
        pass:envVars.EMAIL_SENDER.SMTP_PASSWORD
    },
    port:parseInt(envVars.EMAIL_SENDER.SMTP_PORT)
})


//email sending function
export interface sendEmailOptions{
    to:string;
    subject:string;
    templateName:string;
    templateData:Record<string,any>;
    attachments?:{
        fileName:string;
        context:Buffer|string;
        contentType:string;
    }[]
}
export const sendEmail = async({subject, templateData, templateName, to, attachments}:sendEmailOptions )=>{
    try{
  const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`)
  //render html
  const html = await ejs.renderFile(templatePath, templateData);
  const info = await transporter.sendMail({
    from:envVars.EMAIL_SENDER.SMTP_FROM,
    to:to,
    subject:subject,
    html:html,
    attachments:attachments?.map((attachment) => ({
        filename:attachment.fileName,
        content:attachment.contentType,
        contentType:attachment.contentType
    }))
  })
  console.log(`email sent ${to}: ${info.messageId} `);
    }
    catch(err:any){
        console.log("email sending error", err.message);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "failed to send")
    }
}