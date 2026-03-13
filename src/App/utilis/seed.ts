/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../../config/env";
import { Role } from "../../generated/prisma/enums"
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma"

export const seedSuperAdmin = async()=>{
    try{
    const isSuperAdminExists = await prisma.user.findFirst({
        where:{
            role:Role.SUPER_ADMIN
        }
    })
    if(isSuperAdminExists){
        console.log("super admin already exists");
        return;
    }


    const superAdminUser = await auth.api.signUpEmail({
        body:{
            email:envVars.SUPER_ADMIN_EMAIL,
            password:envVars.SUPER_ADMIN_PASSWORD,
            name:"Super Admin Saheb",
            role:Role.SUPER_ADMIN,
            needPasswordChange:true,
            rememberMe:false
        }
    })



 await prisma.$transaction(async(tx)=>{
        await tx.user.update({
            where:{
                id:superAdminUser.user.id
            },
            data:{
                emailVerified:true
            }
        })



        await tx.admin.create({
            data:{
                userId:superAdminUser.user.id,
                name:'Super Admin Saheb',
                email:envVars.SUPER_ADMIN_EMAIL,
               
            }
        })



    })

    const superAdmin = await prisma.admin.findFirst({
        where:{
            email:envVars.SUPER_ADMIN_EMAIL
        },
        include:{
            user:true
        }
    })
  console.log('super admin created', superAdmin);
    }

    catch(error:any){
     console.error("Error sending super admin", error)
   
     await prisma.user.delete({
        where:{
            email:envVars.SUPER_ADMIN_EMAIL
        }
     })

    }
}