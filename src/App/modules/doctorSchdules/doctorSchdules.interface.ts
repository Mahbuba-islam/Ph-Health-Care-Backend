export interface ICreateDoctorSchdulePayload{
  scheduleIds : string[]
}


export interface IUpdateDoctorSchdulePayloads {
    scheduleIds:{
        shouldDelete:boolean;
        id:string
    }[]
}