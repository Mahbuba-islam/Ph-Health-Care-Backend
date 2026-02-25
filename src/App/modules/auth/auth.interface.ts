export interface IRegisteredPatientPayload {
    name:string;
    email:string;
    password:string
    deletedAt:Date
}


export interface ILoginUserPayload{
    email:string
    password:string
}


export interface IChangePasswordPayload {
  currentPassword:string
  newPassword:string
}