import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

import { ISpeciality } from "./speciality.interface";

const createSpeciality = async (payload:ISpeciality) => {
  const speciality = await prisma.speciality.create({
    data: {
      title: payload.title,
      description: payload.description,
      icon: payload.icon
    }
  });

  return speciality;
};


 // getAllSpecility
const getAllSpecility = async () : Promise<Speciality[]> => {
    const speciality = await prisma.speciality.findMany()
    return speciality
}


 // delete Specility
const deleteSpecility = async (id:string) : Promise<Speciality> => {
    const speciality = await prisma.speciality.delete({
       where: {id}
    })
    return speciality
}

 // delete Specility
const updateSpeciality = async (id:string, data:Partial<Speciality>) : Promise<Speciality> => {
    const speciality = await prisma.speciality.update({
       where: { id},
       data
    })
    return speciality
}





export const specialityService = {
    createSpeciality,
    getAllSpecility,
    deleteSpecility,
    updateSpeciality
} 