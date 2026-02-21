// amra asole kise set korte chaschi amader cookie ta amra jokhon response a pathabo tokhon responser 
// moddhe cookie ta set korte chaschi.
// abr amra jokhon cookie ta get korte chaschi tokhon amra kothai thake get korbo--
//user amader ke frontend thake ja request ta dischilos sa request er moddhe kintu cookie ta thakbe. sa 
//requester cookie thake amra token ta get korte pari.
// amra jokhon set korbo tokhon amader lagbe responser ja obj ta ace sata lagbe.
// cookie set korar jonno 2 ta value lagbe 1 ta key r akta value.


import { CookieOptions, Request, Response } from "express";


const setCookie = (res:Response, key:string, value:string, options:CookieOptions) => {
 res.cookie(key,value, options)
}


const getCookie = (req:Request, key:string) => {
    return req.cookies[key]
}


const clearCookie = (res:Response, key:string, options:CookieOptions)=> {
    res.clearCookie(key, options)
}

export const cookieUtils = {setCookie, getCookie, clearCookie}