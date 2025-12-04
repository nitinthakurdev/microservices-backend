import {Router,Request,Response} from "express";



const router:Router = Router();


export function healthRoute(): Router {
    router.route('/notification-health').get((_req:Request,res:Response)=>res.send("notification service healthy and ok"));
    return router
}







